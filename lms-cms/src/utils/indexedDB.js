import { openDB } from 'idb';

const dbName = 'CMS';
const dbVersion = 1;

// Inisialisasi database
const initDB = async () => {
    return openDB(dbName, dbVersion, {
        upgrade(db) {

            // Dashboard
            if (!db.objectStoreNames.contains('dashboard')) {
                db.createObjectStore('dashboard', { keyPath: 'id' });
            }

            // Course Manajemen
            if (!db.objectStoreNames.contains('courseData')) {
                db.createObjectStore('courseData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('courseDetail')) {
                db.createObjectStore('courseDetail', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('quizzesData')) {
                db.createObjectStore('quizzesData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('materialsData')) {
                db.createObjectStore('materialsData', { keyPath: 'id_course_material' });
            }
            if (!db.objectStoreNames.contains('assignmentsData')) {
                db.createObjectStore('assignmentsData', { keyPath: 'id' });
            }

            // User Manajemen
            if (!db.objectStoreNames.contains('adminData')) {
                db.createObjectStore('adminData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('studentData')) {
                db.createObjectStore('studentData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('teacherData')) {
                db.createObjectStore('teacherData', { keyPath: 'id' });
            }

            // Content Manajemen System
            if (!db.objectStoreNames.contains('medpartData')) {
                db.createObjectStore('medpartData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('sosmedData')) {
                db.createObjectStore('sosmedData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('aboutUsData')) {
                db.createObjectStore('aboutUsData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('TCData')) {
                db.createObjectStore('TCData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('FAQData')) {
                db.createObjectStore('FAQData', { keyPath: 'id_faq' });
            }

            // Master Data
            if (!db.objectStoreNames.contains('levelTeacherData')) {
                db.createObjectStore('levelTeacherData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('levelCourseData')) {
                db.createObjectStore('levelCourseData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('categoryData')) {
                db.createObjectStore('categoryData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('skillData')) {
                db.createObjectStore('skillData', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('toolsData')) {
                db.createObjectStore('toolsData', { keyPath: 'id' });
            }

            // Help Desk
            if (!db.objectStoreNames.contains('helpDeskData')) {
                db.createObjectStore('helpDeskData', { keyPath: 'id' });
            }

            // User Data
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
            if (!db.objectStoreNames.contains('loginData')) {
                db.createObjectStore('loginData', { keyPath: 'key' });
            }
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'key' });
            }
        },
    });
};

// Simpan data ke object store
const saveToDB = async (storeName, data) => {
    try {
        const db = await initDB();
        if (Array.isArray(data)) {
            // Jika data adalah array, tambahkan satu per satu
            const tx = db.transaction(storeName, 'readwrite');
            for (const item of data) {
                await tx.store.put(item);
            }
            await tx.done;
        } else {
            // Jika data adalah objek tunggal
            await db.put(storeName, data);
        }
    } catch (error) {
        console.error(`Error saving to ${storeName}:`, error);
    }
};

// Ambil data dari object store berdasarkan ID
const getFromDB = async (storeName, id) => {
    try {
        const db = await initDB();
        return await db.get(storeName, id);
    } catch (error) {
        console.error(`Error getting from ${storeName}:`, error);
        return null;
    }
};

// Ambil semua data dari object store
const getAllFromDB = async (storeName) => {
    try {
        const db = await initDB();
        return await db.getAll(storeName);
    } catch (error) {
        console.error(`Error getting all from ${storeName}:`, error);
        return [];
    }
};

// Hapus data dari object store berdasarkan ID
const deleteFromDB = async (storeName, id) => {
    try {
        const db = await initDB();
        await db.delete(storeName, id);
    } catch (error) {
        console.error(`Error deleting from ${storeName}:`, error);
    }
};

// Hapus semua data dari object store
const clearStore = async (storeName) => {
    try {
        const db = await initDB();
        await db.clear(storeName);
    } catch (error) {
        console.error(`Error clearing ${storeName}:`, error);
    }
};

// Perbarui data di object store berdasarkan ID
const updateInDB = async (storeName, id, updatedData) => {
    try {
        const db = await initDB();
        const existingData = await db.get(storeName, id);
        if (existingData) {
            const newData = { ...existingData, ...updatedData };
            await db.put(storeName, newData);
        } else {
            console.warn(`No data found in ${storeName} with ID: ${id}`);
        }
    } catch (error) {
        console.error(`Error updating in ${storeName}:`, error);
    }
};

// Ekspor semua fungsi untuk digunakan secara global
export {
    saveToDB,
    getFromDB,
    getAllFromDB,
    deleteFromDB,
    clearStore,
    updateInDB,
};


{/* <script setup>
    import { saveToDB, getFromDB, getAllFromDB, deleteFromDB } from '@/utils/indexedDB';

// Contoh penyimpanan data
const saveData = async () => {
    const data = { id: '123', title: 'Example Material', description: 'Some description' };
    await saveToDB('materials', data);
    console.log('Data saved to IndexedDB');
};

// Contoh pengambilan data berdasarkan ID
const getData = async () => {
    const data = await getFromDB('materials', '123');
    console.log('Retrieved data:', data);
};

// Contoh pengambilan semua data
const getAllData = async () => {
    const allData = await getAllFromDB('materials');
    console.log('All data:', allData);
};

// Contoh penghapusan data berdasarkan ID
const deleteData = async () => {
    await deleteFromDB('materials', '123');
    console.log('Data deleted from IndexedDB');
};

onMounted(() => {
    saveData();
    getData();
    getAllData();
});
</script> */}
