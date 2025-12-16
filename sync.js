// ==========================================
// SYNC MANAGER - Sincronización automática con Firebase
// ==========================================
// Este script sincroniza automáticamente localStorage con Firebase
// sin necesidad de cambiar el código existente

class SyncManager {
    constructor() {
        this.db = null;
        this.auth = null;
        this.userId = null;
        this.isOnline = false;
        this.syncEnabled = ENABLE_FIREBASE;
        this.syncInterval = null;

        if (this.syncEnabled) {
            this.init();
        }
    }

    async init() {
        try {
            // Inicializar Firebase
            firebase.initializeApp(FIREBASE_CONFIG);
            this.db = firebase.firestore();
            this.auth = firebase.auth();

            // Habilitar persistencia offline
            try {
                await this.db.enablePersistence({ synchronizeTabs: true });
            } catch (err) {
                if (err.code === 'failed-precondition') {
                    console.warn('Múltiples pestañas abiertas, persistencia deshabilitada');
                }
            }

            // Autenticación anónima
            await this.signInAnonymously();

            this.isOnline = true;
            console.log('✅ Firebase conectado - Sincronización automática habilitada');

            // Sincronizar datos iniciales
            await this.syncFromCloud();

            // Sincronizar cada 30 segundos
            this.startAutoSync();

            // Mostrar estado en UI
            this.showSyncStatus('online');
        } catch (error) {
            console.warn('⚠️ Firebase no disponible, usando solo localStorage:', error.message);
            this.isOnline = false;
            this.syncEnabled = false;
            this.showSyncStatus('offline');
        }
    }

    async signInAnonymously() {
        try {
            // Intentar recuperar usuario existente
            const savedUserId = localStorage.getItem('firebaseUserId');

            const result = await this.auth.signInAnonymously();
            this.userId = result.user.uid;

            // Si es un usuario nuevo y teníamos datos previos, migrar
            if (savedUserId && savedUserId !== this.userId) {
                console.log('Detectado cambio de usuario, migrando datos...');
                await this.migrateLocalDataToCloud();
            }

            localStorage.setItem('firebaseUserId', this.userId);
            console.log('👤 Usuario autenticado:', this.userId.substring(0, 8) + '...');
        } catch (error) {
            console.error('Error en autenticación:', error);
            throw error;
        }
    }

    startAutoSync() {
        // Sincronizar cada 30 segundos
        this.syncInterval = setInterval(() => {
            this.syncToCloud();
        }, 30000);

        // Sincronizar antes de cerrar la pestaña
        window.addEventListener('beforeunload', () => {
            this.syncToCloud();
        });
    }

    async syncToCloud() {
        if (!this.syncEnabled || !this.isOnline || !this.userId) return;

        const collections = ['subjects', 'exams', 'goals', 'sessions', 'gamification', 'timer'];

        try {
            const batch = this.db.batch();

            for (const collection of collections) {
                const localData = this.getLocalData(collection);
                if (localData) {
                    const ref = this.db
                        .collection('users')
                        .doc(this.userId)
                        .collection(collection)
                        .doc('data');

                    batch.set(ref, {
                        data: localData,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }
            }

            await batch.commit();
            this.showSyncStatus('synced');
        } catch (error) {
            console.warn('Error al sincronizar con la nube:', error.message);
            this.showSyncStatus('error');
        }
    }

    async syncFromCloud() {
        if (!this.syncEnabled || !this.isOnline || !this.userId) return;

        const collections = ['subjects', 'exams', 'goals', 'sessions', 'gamification', 'timer'];

        try {
            for (const collection of collections) {
                const doc = await this.db
                    .collection('users')
                    .doc(this.userId)
                    .collection(collection)
                    .doc('data')
                    .get();

                if (doc.exists) {
                    const cloudData = doc.data().data;
                    const localData = this.getLocalData(collection);

                    // Solo sobrescribir si hay datos en la nube y no hay locales
                    if (!localData || this.isCloudDataNewer(doc.data(), collection)) {
                        this.setLocalData(collection, cloudData);
                        console.log(`📥 ${collection} descargado desde la nube`);
                    }
                }
            }

            // Recargar datos en la UI
            if (window.app) {
                window.app.loadSubjectsToSelect();
                window.app.loadExams();
                window.app.loadGoals();
                window.app.updateStatistics();
                window.app.updateHistory();
                window.app.renderGamification();
            }

            this.showSyncStatus('synced');
        } catch (error) {
            console.warn('Error al descargar desde la nube:', error.message);
        }
    }

    async migrateLocalDataToCloud() {
        console.log('Migrando datos locales a la nube...');
        await this.syncToCloud();
    }

    isCloudDataNewer(cloudDoc, collection) {
        // Comparar timestamp si existe
        const localTimestamp = localStorage.getItem(`${collection}_timestamp`);
        if (!localTimestamp) return true;

        const cloudTimestamp = cloudDoc.updatedAt?.toMillis();
        return cloudTimestamp > parseInt(localTimestamp);
    }

    getLocalData(collection) {
        let key;
        if (collection === 'timer') {
            key = 'pomodoroGatito';
        } else {
            key = collection;
        }

        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    setLocalData(collection, data) {
        let key;
        if (collection === 'timer') {
            key = 'pomodoroGatito';
        } else {
            key = collection;
        }

        localStorage.setItem(key, JSON.stringify(data));
        localStorage.setItem(`${collection}_timestamp`, Date.now().toString());
    }

    showSyncStatus(status) {
        const statusEl = document.getElementById('syncStatus');
        if (!statusEl) return;

        const statusConfig = {
            online: { icon: '🟢', text: 'Sincronización activa' },
            offline: { icon: '🔴', text: 'Solo local' },
            synced: { icon: '✅', text: 'Sincronizado' },
            error: { icon: '⚠️', text: 'Error de sincronización' }
        };

        const config = statusConfig[status] || statusConfig.offline;
        statusEl.innerHTML = `<span>${config.icon} ${config.text}</span>`;
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
            exportDate: new Date().toISOString(),
            userId: this.userId
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pomodoro-gatito-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert('✅ Datos exportados correctamente');
    }

    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Validar estructura
            const requiredKeys = ['timer', 'subjects', 'exams', 'goals', 'sessions', 'gamification'];
            const hasValidStructure = requiredKeys.every(key => data.hasOwnProperty(key));

            if (!hasValidStructure) {
                throw new Error('Formato de archivo inválido');
            }

            // Confirmar antes de importar
            if (!confirm('¿Estás seguro de importar estos datos? Se sobrescribirán los datos actuales.')) {
                return;
            }

            // Importar datos
            for (const [key, value] of Object.entries(data)) {
                if (key !== 'exportDate' && key !== 'userId') {
                    this.setLocalData(key, value);
                }
            }

            // Sincronizar a la nube si está disponible
            if (this.syncEnabled && this.isOnline) {
                await this.syncToCloud();
            }

            // Recargar página para actualizar UI
            alert('✅ Datos importados correctamente. La página se recargará.');
            window.location.reload();
        } catch (error) {
            alert('❌ Error al importar datos: ' + error.message);
        }
    }

    async clearAllData() {
        if (!confirm('¿Estás seguro de borrar TODOS los datos? Esta acción no se puede deshacer.')) {
            return;
        }

        const collections = ['subjects', 'exams', 'goals', 'sessions', 'gamification', 'timer'];

        // Borrar de localStorage
        collections.forEach(collection => {
            const key = collection === 'timer' ? 'pomodoroGatito' : collection;
            localStorage.removeItem(key);
            localStorage.removeItem(`${collection}_timestamp`);
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

        alert('✅ Todos los datos han sido borrados. La página se recargará.');
        window.location.reload();
    }

    getConnectionStatus() {
        return {
            enabled: this.syncEnabled,
            online: this.isOnline,
            userId: this.userId ? this.userId.substring(0, 8) + '...' : null
        };
    }
}

// Instancia global
const syncManager = new SyncManager();
