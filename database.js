// ==========================================
// DATABASE MANAGER - Firebase + localStorage
// ==========================================

class DatabaseManager {
    constructor() {
        this.db = null;
        this.auth = null;
        this.userId = null;
        this.isOnline = false;
        this.syncEnabled = ENABLE_FIREBASE;
        this.pendingSync = new Set();

        if (this.syncEnabled) {
            this.initFirebase();
        }
    }

    async initFirebase() {
        try {
            // Inicializar Firebase
            firebase.initializeApp(FIREBASE_CONFIG);
            this.db = firebase.firestore();
            this.auth = firebase.auth();

            // Habilitar persistencia offline
            await this.db.enablePersistence({ synchronizeTabs: true });

            // Autenticación anónima
            await this.signInAnonymously();

            this.isOnline = true;
            console.log('✅ Firebase conectado correctamente');

            // Sincronizar datos al conectar
            this.syncFromCloud();
        } catch (error) {
            console.warn('⚠️ Firebase no disponible, usando solo localStorage:', error.message);
            this.isOnline = false;
            this.syncEnabled = false;
        }
    }

    async signInAnonymously() {
        try {
            const result = await this.auth.signInAnonymously();
            this.userId = result.user.uid;

            // Guardar userId en localStorage para recuperarlo
            localStorage.setItem('firebaseUserId', this.userId);

            console.log('👤 Usuario autenticado:', this.userId);
        } catch (error) {
            console.error('Error en autenticación:', error);
            throw error;
        }
    }

    // ==========================================
    // MÉTODOS GENÉRICOS DE LECTURA/ESCRITURA
    // ==========================================

    async saveData(collection, data) {
        // Siempre guardar en localStorage primero (inmediato)
        const localKey = `pomodoro_${collection}`;
        localStorage.setItem(localKey, JSON.stringify(data));

        // Si Firebase está habilitado, sincronizar
        if (this.syncEnabled && this.isOnline && this.userId) {
            try {
                await this.db
                    .collection('users')
                    .doc(this.userId)
                    .collection(collection)
                    .doc('data')
                    .set({
                        data: data,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
            } catch (error) {
                console.warn(`No se pudo sincronizar ${collection}:`, error.message);
                this.pendingSync.add(collection);
            }
        }
    }

    async getData(collection) {
        const localKey = `pomodoro_${collection}`;

        // Intentar obtener de Firebase si está disponible
        if (this.syncEnabled && this.isOnline && this.userId) {
            try {
                const doc = await this.db
                    .collection('users')
                    .doc(this.userId)
                    .collection(collection)
                    .doc('data')
                    .get();

                if (doc.exists) {
                    const cloudData = doc.data().data;
                    // Actualizar localStorage con datos de la nube
                    localStorage.setItem(localKey, JSON.stringify(cloudData));
                    return cloudData;
                }
            } catch (error) {
                console.warn(`Error al leer ${collection} de Firebase:`, error.message);
            }
        }

        // Fallback a localStorage
        const localData = localStorage.getItem(localKey);
        return localData ? JSON.parse(localData) : null;
    }

    async syncFromCloud() {
        if (!this.syncEnabled || !this.isOnline || !this.userId) return;

        const collections = ['subjects', 'exams', 'goals', 'sessions', 'gamification', 'timer'];

        for (const collection of collections) {
            try {
                const data = await this.getData(collection);
                if (data) {
                    console.log(`✅ ${collection} sincronizado desde la nube`);
                }
            } catch (error) {
                console.warn(`Error sincronizando ${collection}:`, error.message);
            }
        }
    }

    async retrySyncPending() {
        if (!this.syncEnabled || !this.isOnline || this.pendingSync.size === 0) return;

        for (const collection of this.pendingSync) {
            const localKey = `pomodoro_${collection}`;
            const data = localStorage.getItem(localKey);

            if (data) {
                try {
                    await this.saveData(collection, JSON.parse(data));
                    this.pendingSync.delete(collection);
                } catch (error) {
                    console.warn(`Error al reintentar sincronización de ${collection}`);
                }
            }
        }
    }

    // ==========================================
    // EXPORTAR/IMPORTAR DATOS
    // ==========================================

    exportAllData() {
        const data = {
            timer: this.getLocalData('timer'),
            subjects: this.getLocalData('subjects'),
            exams: this.getLocalData('exams'),
            goals: this.getLocalData('goals'),
            sessions: this.getLocalData('sessions'),
            gamification: this.getLocalData('gamification'),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pomodoro-gatito-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    async importData(jsonFile) {
        try {
            const text = await jsonFile.text();
            const data = JSON.parse(text);

            // Validar estructura
            const requiredKeys = ['timer', 'subjects', 'exams', 'goals', 'sessions', 'gamification'];
            const hasValidStructure = requiredKeys.every(key => data.hasOwnProperty(key));

            if (!hasValidStructure) {
                throw new Error('Formato de archivo inválido');
            }

            // Importar datos
            for (const [key, value] of Object.entries(data)) {
                if (key !== 'exportDate') {
                    await this.saveData(key, value);
                }
            }

            return { success: true, message: 'Datos importados correctamente' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    getLocalData(collection) {
        const localKey = `pomodoro_${collection}`;
        const data = localStorage.getItem(localKey);
        return data ? JSON.parse(data) : null;
    }

    // ==========================================
    // BORRAR TODOS LOS DATOS
    // ==========================================

    async clearAllData() {
        const collections = ['subjects', 'exams', 'goals', 'sessions', 'gamification', 'timer'];

        // Borrar de localStorage
        collections.forEach(collection => {
            localStorage.removeItem(`pomodoro_${collection}`);
        });

        // Borrar de Firebase
        if (this.syncEnabled && this.isOnline && this.userId) {
            try {
                const batch = this.db.batch();

                for (const collection of collections) {
                    const ref = this.db
                        .collection('users')
                        .doc(this.userId)
                        .collection(collection)
                        .doc('data');
                    batch.delete(ref);
                }

                await batch.commit();
                console.log('✅ Datos borrados de Firebase');
            } catch (error) {
                console.warn('Error al borrar datos de Firebase:', error.message);
            }
        }
    }

    // ==========================================
    // ESTADO DE CONEXIÓN
    // ==========================================

    getConnectionStatus() {
        return {
            enabled: this.syncEnabled,
            online: this.isOnline,
            userId: this.userId,
            pendingSync: this.pendingSync.size
        };
    }
}

// Instancia global
const dbManager = new DatabaseManager();
