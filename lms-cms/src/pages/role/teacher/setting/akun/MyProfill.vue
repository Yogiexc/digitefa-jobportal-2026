<script setup>
import { ref, onMounted } from 'vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import axios from 'axios';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import * as bootstrap from 'bootstrap';
import { getFromDB, saveToDB } from '@/utils/indexedDB';

const isEditing = ref(false);
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const imagePreview = ref(null);
const uploadedFileName = ref('');
const certifications = ref([]);
const newCertification = ref('');
const currentFile = ref(null);
const teacherData = ref([]);
const profileImage = ref('');
const selectedFileUrl = ref('');
const selectedFileType = ref('');
const selectedFileName = ref('');
const isHovered = ref(false);
const areaofexpertiseOptions = ref([]);
const selectedAreas = ref([]);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');
const certificate = ref(null);
const certificateFile = ref(null);
const certificateInputRef = ref(null);
const portofolioFile = ref(null);
const portofolioInputRef = ref(null);
const identityInputRef = ref(null);
const identityFile = ref(null);
const portofolio = ref(null);
const identity = ref(null);



const user = ref({
    name: '',
    email: '',
    teacher: {
        date_of_birth: '',
        address: '',
        education: '',
        year_of_experience: '',
        phone_number: '',
        photo_profile: '',
        portofolio: '',
        identity: '',
        certificates: [],
        categories: '',
        affiliation: '',
    }
});

const form = ref({
    certificates: []
});

const newCertificate = ref({
    name: '',
    file: null
});

const handleFileUpload2 = (type, event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
        if (uploadedFile.size <= 15 * 1024 * 1024) {
            const fileData = {
                name: uploadedFile.name,
                size: (uploadedFile.size / 1024).toFixed(2),
                url: URL.createObjectURL(uploadedFile),
            };
            if (type === 'portofolio') {
                portofolioFile.value = fileData;
                portofolio.value = uploadedFile;
            } else if (type === 'identity') {
                identityFile.value = fileData;
                identity.value = uploadedFile;
            } else if (type === 'certificate') {
                certificateFile.value = fileData;
                certificate.value = uploadedFile;
            }
        } else {
            alert('Ukuran file terlalu besar. Maksimal 15MB.');
        }
    }
};

const removeFile = (type) => {
    if (type === 'portofolio') {
        portofolioFile.value = null;
        if (portofolioInputRef.value) portofolioInputRef.value.value = '';
    } else if (type === 'identity') {
        identityFile.value = null;
        if (identityInputRef.value) identityInputRef.value.value = '';
    } else if (type === 'certificate') {
        certificateFile.value = null;
        if (certificateInputRef.value) certificateInputRef.value.value = '';
    }
};

const deleteCertificate = (index) => {
    form.value.certificates.splice(index, 1);
};


// const triggerFileInput = (type) => {
//     if (type === 'portofolio' && portofolioInputRef.value) {
//         portofolioInputRef.value.click();
//     } else if (type === 'identity' && identityInputRef.value) {
//         identityInputRef.value.click();
//     } else if (type === 'certificate' && certificateInputRef.value) {
//         certificateInputRef.value.click();
//     }
// };


const showAddCertificateModal = () => {
    certificateFile.value = null;
    isModalVisible.value = true;
};

const closeAddCertificateModal = () => {
    isModalVisible.value = false;
};

const addCertificate = () => {
    if (!newCertificate.value.name || !certificateFile.value) {
        alert('Nama sertifikat dan file wajib diisi.');
        return;
    }

    form.value.certificates.push({
        name: newCertificate.value.name,
        fileName: certificateFile.value.name,
        fileUrl: certificateFile.value.url,
        file: certificate.value,
    });

    newCertificate.value.name = '';
    certificate.value = null;
    certificateFile.value = null;
    closeAddCertificateModal();
};


const fetchCategoryData = async () => {
    try {
        const response = await axios.get('/categories');
        const categories = response.data;

        areaofexpertiseOptions.value = categories.map((category) => ({
            label: category.name,
            value: category.id_category,
        }));
    } catch (error) {
        console.error('Error fetching category data:', error);
    }
};


const toggleEditMode = () => {
    if (isEditing.value) {
        saveProfile();
    }
    isEditing.value = !isEditing.value;
};

const showAddSertifModal = () => {
    isModalVisible.value = true;
    uploadedFileName.value = '';
    newCertification.value = '';
    currentFile.value = null;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeAddSertifModal = () => {
    isModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const handleFileUploadSertif = (event) => {
    const file = event.target.files[0];
    if (file) {
        const validExtensions = ['pdf', 'jpg', 'png'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            alert('Invalid file type. Please upload a PDF, JPG, or PNG file.');
            return;
        }
        uploadedFileName.value = file.name;
        currentFile.value = file;
    }
};

const triggerFileInput = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    }
};

const handleFile = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
        currentFile.value = file;
    }
};

const saveToLocalStorage = (data) => {
    localStorage.setItem('teacherData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('teacherData');
    if (storedData) {
        teacherData.value = JSON.parse(storedData);
    }
};

const fetchTeacherData = async () => {
    const token = await getFromDB('settings', 'token');
    if (!token) {
        console.error('Token not found in indexedDB.');
        return;
    }
    try {
        const response = await axios.get('/user', {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        
        const teacherIdentityUrl = process.env.VUE_APP_TEACHER_IDENTITY_URL;
        const teacherPortofolioUrl = process.env.VUE_APP_TEACHER_PORTOFOLIO_URL;
        const teacherProfileUrl = process.env.VUE_APP_TEACHER_PROFILE_URL;
        const teacherCertificatesUrl = process.env.VUE_APP_TEACHER_CERTIFICATE_URL;

        const userData = response.data.user;
        await saveToDB('users', userData);
        user.value = userData;

        user.value.teacher.photo_profile = userData.teacher?.photo_profile
            ? `${teacherProfileUrl}/${userData.teacher.photo_profile}`
            : require('@/assets/images/my-profile.png');

        user.value.teacher.categories = userData.teacher?.categories_teacher?.map(cat => cat.name).join(', ') || ''

        selectedAreas.value = userData.teacher?.categories_teacher.map((cat) => ({
            label: cat.name,
            value: cat.id_category,
        })) || [];

        profileImage.value = user.value.teacher.photo_profile || require('@/assets/images/my-profile.png');

        if (userData.teacher?.portofolio) {
            user.value.teacher.portofolio = {
                name: userData.teacher.portofolio,
                url: `${teacherPortofolioUrl}/${userData.teacher.portofolio}`,
            };
        }

        if (userData.teacher?.identity) {
            user.value.teacher.identity = {
                name: userData.teacher.identity,
                url: `${teacherIdentityUrl}/${userData.teacher.identity}`,
            };
        }

        if (userData.teacher?.teacher_certificates) {
            user.value.teacher.certificates = userData.teacher.teacher_certificates.map(cert => ({
                name: cert.name,
                url: `${teacherCertificatesUrl}/${cert.file}`,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
};


const saveProfile = async () => {
    try {
        const userId = await getFromDB('users', 'id_user');

        if (!userId) {
            alert('User ID not found.');
            return;
        }

        const formData = new FormData();
        formData.append('address', user.value.teacher.address);
        formData.append('phone_number', user.value.teacher.phone_number);
        formData.append('date_of_birth', user.value.teacher.date_of_birth);
        formData.append('education', user.value.teacher.education);
        formData.append('year_of_experience', user.value.teacher.year_of_experience);
        formData.append('affiliation', user.value.teacher.affiliation);

        if (currentFile.value) {
            formData.append('photo_profile', currentFile.value);
        }

        selectedAreas.value.forEach((area) => {
            formData.append('categories[]', area.value);
        });

        form.value.certificates.forEach((cert, index) => {
            formData.append(`certificates[${index}][name]`, cert.name);
            formData.append(`certificates[${index}][file]`, cert.file);
        });

        if (portofolio.value) {
            formData.append('portofolio', portofolio.value);
        }

        if (identity.value) {
            formData.append('identity', identity.value);
        }

        const response = await axios.post(`/teacher-updateProfile-request/${userId.id_user}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        fetchTeacherData();
        showToast('Profil Anda berhasil diperbarui!', 'success');
    } catch (error) {
        const message =
            error.response?.data?.message || 'Gagal mengajukan pembaruan profil.';
        showToast(message, 'error');
    }
};


const submitForm = () => {
    if (!newCertification.value || !currentFile.value) {
        alert('Please complete the form before saving.');
        return;
    }

    // Tambahkan data sertifikat ke tabel
    certifications.value.push({
        id: certifications.value.length + 1,
        name: newCertification.value,
        fileName: uploadedFileName.value,
    });

    // Tutup modal
    closeAddSertifModal();
};

const showDeleteSertifikasiModal = () => {
    isDeleteModalVisible.value = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeDeleteSertifikasiModal = () => {
    isDeleteModalVisible.value = false;
    mediapartnerToDelete.value = null;

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const deleteCertification = (id) => {
    certifications.value = certifications.value.filter(cert => cert.id !== id);
};


const getFileSize = async (fileUrl) => {
    try {
        const response = await axios.head(fileUrl);
        const fileSize = response.headers['content-length'];
        return (fileSize / 1024).toFixed(2) + ' KB';
    } catch (error) {
        console.error('Error fetching file size:', error);
        return 'Unknown';
    }
};

// const zoomFile = (type) => {
//     if (type === 'portofolio' && portofolioFile.value) {
//         selectedFileUrl.value = portofolioFile.value.url;
//         selectedFileType.value = 'pdf';
//         selectedFileName.value = portofolioFile.value.name;
//     } else if (type === 'identity' && identityFile.value) {
//         selectedFileUrl.value = identityFile.value.url;
//         selectedFileType.value = 'pdf';
//         selectedFileName.value = identityFile.value.name;
//     } else if (type === 'certificate' && certificateFile.value) {
//         selectedFileUrl.value = certificateFile.value.url;
//         selectedFileType.value = 'pdf';
//         selectedFileName.value = certificateFile.value.name;
//     }

//     const myModal = new bootstrap.Modal(document.getElementById('pdfModal'));
//     myModal.show();
// };


const zoomFile = (fileUrl, fileName, fileType) => {
    selectedFileUrl.value = fileUrl;
    selectedFileType.value = fileType;
    selectedFileName.value = fileName;
    const myModal = new bootstrap.Modal(document.getElementById('pdfModal'));
    myModal.show();
};

const showToast = (message, type = 'success') => {
    toastMessage.value = message;
    isToastVisible.value = true;
    toastClass.value = type === 'success' ? 'bg-light-success' : 'bg-light-error';
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const closeToast = () => {
    isToastVisible.value = false;
};

onMounted(() => {
    fetchCategoryData();
    fetchTeacherData();
    loadFromLocalStorage();
});
</script>

<template>
    <div v-if="isEditing">
        <div class="position-relative me-3" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
            <img v-if="imagePreview || user.teacher.photo_profile" :src="imagePreview || user.teacher.photo_profile"
                alt="Profile" class="rounded-circle profil-teacher" style="width: 100px; height: 100px;" />
            <img v-else src="../../../../../assets/images/ak.png" alt="Default Profile"
                class="rounded-circle profil-teacher" style="width: 100px; height: 100px;" />
            <input type="file" id="fileInput" hidden accept="image/*" @change="handleFile" />
            <button type="button" class="btn position-absolute top-50 translate-middle p-6" @click="triggerFileInput"
                v-show="isHovered">
                <i class="bi bi-pencil-square"></i>
            </button>
        </div>
    </div>
    <div v-else>
        <img :src="profileImage" alt="profil" class="rounded-circle mb-2" style="width: 100px; height: 100px;">
    </div>
    <div class="d-flex justify-content-end">
        <ButtonBiru @click="toggleEditMode" class="ms-3 h-40 px-3 rounded-3 fs-16">
            <i class="bi bi-pencil-square me-1 fs-16"></i>
            {{ isEditing ? 'Save' : 'Edit' }}
        </ButtonBiru>
    </div>
    <div v-if="isEditing">
        <form @submit.prevent="saveProfile">
            <div class="row mt-3 my">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="name" class="form-label mb-0 fs-16">Full Name</label>
                        <input type="text" id="name" class="form-control h-45 fs-14" placeholder="Enter your full name"
                            v-model="user.name" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="nohp" class="form-label mb-0 fs-16">No.Telp</label>
                        <input type="text" id="nohp" class="form-control h-45 fs-14"
                            placeholder="Enter your phone number" v-model="user.teacher.phone_number">
                    </div>
                    <div class="mb-3">
                        <label for="te" class="form-label mb-0 fs-16">Teaching Experience</label>
                        <select class="form-select w-100 h-45 fs-14 opacity-75"
                            v-model="user.teacher.year_of_experience">
                            <option value="1-3">1-3 Years</option>
                            <option value="4-6">4-6 Years</option>
                            <option value="7+">7+ Years</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="afiliator" class="form-label mb-0 fs-16">Affiliator</label>
                        <input type="text" id="afiliator" class="form-control h-45 fs-14"
                            placeholder="Enter your affiliator" v-model="user.teacher.affiliation">
                    </div>
                    <div class="mb-3">
                        <label for="adreess" class="form-label mb-0 fs-16">Address</label>
                        <input type="text" id="adreess" class="form-control h-45 fs-14" placeholder="Enter your address"
                            v-model="user.teacher.address">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="email" class="form-label mb-0 fs-16">Email</label>
                        <input type="email" id="emaail" class="form-control h-45 fs-14" placeholder="Enter your email"
                            v-model="user.email" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="adreess" class="form-label mb-0 fs-16">Education Level</label>
                        <select class="form-select w-100 h-45 fs-14 opacity-75" v-model="user.teacher.education">
                            <option value="diploma">Diploma</option>
                            <option value="sarjana">Sarjana</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="aoe" class="form-label mb-0 fs-16">Areas of Expertise</label>
                        <MultipleSelect :options="areaofexpertiseOptions" v-model="selectedAreas"
                            placeholder="Select area of expertise" />
                    </div>
                    <div class="mb-3 mt-17">
                        <label for="dob" class="form-label mb-0 fs-16">Date of Birth</label>
                        <input type="date" id="dob" class="form-control h-45 fs-14 opacity-75"
                            placeholder="Enter your date of birth" v-model="user.teacher.date_of_birth">
                    </div>
                </div>
                <div class="mt-5">
                    <div class="card border-1 p-2">
                        <label for="" class="fs-16 mt-2 mb-4">Sertifikasi</label>
                        <div class="table-responsive">
                            <table class="table custom-table rounded-4">
                                <thead class="thead-custom">
                                    <tr class="ps-4">
                                        <th class="ps-3 fs-16 fw-light w-1">No</th>
                                        <th class="fs-16 fw-light w-330">Nama Sertifikat</th>
                                        <th class="fs-16 fw-light w-330">File</th>
                                    </tr>
                                </thead>
                                <tbody class="table-custom">
                                    <tr v-for="(certificate, index) in user.teacher.certificates" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ certificate.name }}</td>
                                        <td>
                                            <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                                style="width: 20px; height: auto;">
                                            <a :href="certificate.url" target="_blank" class="fs-16 ms-1">
                                                {{ certificate.url.split('/').pop() }}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr class="h-40">
                                        <td colspan="4" class="p-1">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <div class="mt-4">
                            <label for="portfolio" class="fs-16 mb-0">Portofolio</label>
                            <div v-if="user.teacher.portofolio" class="card text-center border-c p-2"
                                style="width: 170px; min-height: 220px;">
                                <div class="card-body c-default">
                                    <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                        class="mx-auto d-block" style="width: 70px; height: auto;">
                                </div>
                                <div class="d-flex flex-column align-items-center">
                                    <label class="fs-12 opacity-75">{{ user.teacher.portofolio.name }}</label>
                                </div>
                                <div class="d-flex justify-content-end gap-2 mt-2 bottom-right c-pointer fs-12">
                                    <div class="rounded-1" style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                        <i class="bi bi-zoom-in" @click="zoomFile('portofolio')"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mt-4">
                            <label for="portfolio" class="fs-16 mb-0">Verifikasi Identitas</label>
                            <div v-if="user.teacher.identity" class="card text-center border-c p-2"
                                style="width: 170px; min-height: 220px;">
                                <div class="card-body c-default">
                                    <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                        class="mx-auto d-block" style="width: 70px; height: auto;">
                                </div>
                                <div class="d-flex flex-column align-items-center">
                                    <label class="fs-12 opacity-75">{{ user.teacher.identity.name }}</label>
                                </div>
                                <div class="d-flex justify-content-end gap-2 mt-2 bottom-right c-pointer fs-12">
                                    <div class="rounded-1" style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                        <i class="bi bi-zoom-in" @click="zoomFile('identity')"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div v-else>
        <div class="row mt-3 my">
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="name" class="form-label mb-0 fs-16">Full Name</label>
                    <input type="text" id="name" class="form-control h-45 fs-14" v-model="user.name" disabled>
                </div>
                <div class="mb-3">
                    <label for="nohp" class="form-label mb-0 fs-16">No.Telp</label>
                    <input type="text" id="nohp" class="form-control h-45 fs-14" v-model="user.teacher.phone_number"
                        disabled>
                </div>
                <div class="mb-3">
                    <label for="te" class="form-label mb-0 fs-16">Teaching experience</label>
                    <input type="text" id="te" class="form-control h-45 fs-14" v-model="user.teacher.year_of_experience"
                        disabled>
                </div>
                <div class="mb-3">
                    <label for="afiliator" class="form-label mb-0 fs-16">Afiliator</label>
                    <input type="text" id="afiliator" class="form-control h-45 fs-14" v-model="user.teacher.affiliation"
                        disabled>
                </div>
                <div class="mb-3">
                    <label for="adreess" class="form-label mb-0 fs-16">Address</label>
                    <input type="text" id="adreess" class="form-control h-45 fs-14" v-model="user.teacher.address"
                        disabled>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="email" class="form-label mb-0 fs-16">Email</label>
                    <input type="email" id="emaail" class="form-control h-45 fs-14" v-model="user.email" disabled>
                </div>
                <div class="mb-3">
                    <label for="adreess" class="form-label mb-0 fs-16">Education Level</label>
                    <input type="text" id="adreess" class="form-control h-45 fs-14" v-model="user.teacher.education"
                        disabled>
                </div>
                <div class="mb-3">
                    <label for="aoe" class="form-label mb-0 fs-16">Areas of expertise</label>
                    <input type="text" id="aoe" class="form-control h-45 fs-14" v-model="user.teacher.categories"
                        disabled>
                </div>
                <div class="mb-3 mt-17">
                    <label for="dob" class="form-label mb-0 fs-16">Date of birth</label>
                    <input type="text" id="dob" class="form-control h-45 fs-14" v-model="user.teacher.date_of_birth"
                        disabled>
                </div>
            </div>
            <div>
                <div class="card border-1 p-2">
                    <label for="" class="fs-16 mt-2 mb-4">Sertifikasi</label>
                    <div class="table-responsive">
                        <table class="table custom-table rounded-4">
                            <thead class="thead-custom">
                                <tr class="ps-4">
                                    <th class="ps-3 fs-16 fw-light w-1">No</th>
                                    <th class="fs-16 fw-light w-330">Nama Sertifikat</th>
                                    <th class="fs-16 fw-light w-330">File</th>
                                </tr>
                            </thead>
                            <tbody class="table-custom">
                                <tr v-for="(certificate, index) in user.teacher.certificates" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ certificate.name }}</td>
                                    <td>
                                        <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                            style="width: 20px; height: auto;">
                                        <a :href="certificate.url" target="_blank" class="fs-16 ms-1">
                                            {{ certificate.url.split('/').pop() }}
                                        </a>
                                    </td>
                                </tr>
                                <tr class="h-40">
                                    <td colspan="4" class="p-1">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-md-6">
                    <div class="mt-4">
                        <label for="portfolio" class="fs-16 mb-0">Portofolio</label>
                        <div v-if="user.teacher.portofolio" class="card text-center border-c p-2"
                            style="width: 170px; min-height: 220px;">
                            <div class="card-body c-default">
                                <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                    class="mx-auto d-block" style="width: 70px; height: auto;">
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <label class="fs-12 opacity-75">{{ user.teacher.portofolio.name }}</label>
                            </div>
                            <div class="d-flex justify-content-end gap-2 mt-2 bottom-right c-pointer fs-12">
                                <div class="rounded-1" style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                    <i class="bi bi-zoom-in"
                                        @click.prevent="zoomFile(user.teacher.portofolio.url, user.teacher.portofolio.name, 'pdf')"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mt-4">
                        <label for="portfolio" class="fs-16 mb-0">Verifikasi Identitas</label>
                        <div v-if="user.teacher.identity" class="card text-center border-c p-2"
                            style="width: 170px; min-height: 220px;">
                            <div class="card-body c-default">
                                <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                    class="mx-auto d-block" style="width: 70px; height: auto;">
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <label class="fs-12 opacity-75">{{ user.teacher.identity.name }}</label>
                            </div>
                            <div class="d-flex justify-content-end gap-2 mt-2 bottom-right c-pointer fs-12">
                                <div class="rounded-1" style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                    <i class="bi bi-zoom-in"
                                        @click.prevent="zoomFile(user.teacher.identity.url, user.teacher.identity.name, 'pdf')"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Modal -->
    <div v-if="isModalVisible" class="modal-backdrop" @click="closeAddCertificateModal"></div>
    <div v-if="isModalVisible" class="modal fade show d-block" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true" @click.self="closeAddCertificateModal">
        <div class="modal-dialog custom-modal modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header mb--3">
                    <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                        <i class="bi bi-file-earmark-plus me-1"></i>Add Sertifikasi
                    </h5>
                    <button type="button" class="btn-close fs-12 c-close" @click="closeAddCertificateModal"></button>
                </div>
                <hr class="mt-0">
                <div class="ps-3 pe-4 mt-3 mb-2">
                    <div class="d-flex align-items-center">
                        <label for="courseName" class="me-5 fs-16 mb-0">Name</label>
                        <input type="text" id="courseName" class="form-control w-100 h-45 c-border"
                            placeholder="Enter name course" v-model="newCertificate.name" />
                    </div>
                    <div class="d-flex align-items-start mt-3">
                        <label for="categoryName" class="fs-16 mb-0 me-22">Sertifikasi</label>
                        <div>
                            <div v-if="certificateFile" class="card text-center border-c p-2"
                                style="width: 170px; min-height: 220px;">
                                <div class="card-body c-default">
                                    <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                        class="mx-auto d-block" style="width: 70px; height: auto;">
                                </div>
                                <div class="d-flex flex-column align-items-center">
                                    <label class="fs-12 opacity-75">{{ certificateFile.name }}</label>
                                    <label class="fs-12 opacity-75">({{ certificateFile.size }} KB)</label>
                                </div>
                            </div>
                            <div v-else>
                                <input type="file" ref="certificateInputRef" class="hidden" accept="application/pdf"
                                    @change="handleFileUpload2('certificate', $event)" />
                                <button type="button" class="btn btn-border opacity-75 px-5 py-2 mt-0 mb-1"
                                    @click="triggerFileInput('certificate')">Upload</button>
                            </div>
                            <div class="opacity-75 fs-12">
                                <p class="mb-0">Max file size: 15MB</p>
                                <p>Format: .pdf</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center mb-5">
                    <ButtonTransparanComponen class="mt-4 my-0 h-40 w-30 rounded-3 c-border bg-white fs-16"
                        @click="closeAddCertificateModal">Cancel</ButtonTransparanComponen>
                    <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="addCertificate">
                        Save</ButtonBiru>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="isDeleteModalVisible" class="modal-backdrop" @click="closeDeleteSertifikasiModal">
    </div>
    <div v-if="isDeleteModalVisible" class="modal fade show d-block" role="dialog" aria-labelledby="deleteModalLabel"
        aria-hidden="true" @click.self="closeDeleteSertifikasiModal">
        <div class="modal-dialog custom-modal modal-dialog-centered">
            <div class="modal-content pt-3">
                <div class="modal-header mb-3 d-flex flex-column justify-content-center align-items-center text-center">
                    <PhTrashSimple :size="50" color="#ff4c4c" />
                    <h5 class="mb-4 mt-3 fs-16 fw-medium text-merah">Delete Sertifikasi</h5>
                    <h5 class="fs-16 fw-light opacity-50">
                        Are you sure you want to delete this sertifikasi? Once deleted, this
                        data
                        cannot be restored.
                    </h5>
                </div>
                <div class="d-flex justify-content-center mb-5">
                    <ButtonTransparanComponen class="my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                        @click="closeDeleteSertifikasiModal">No, Cancel
                    </ButtonTransparanComponen>
                    <ButtonMerah class="ms-3 my-0 h-40 w-30 rounded-3 fs-16" @click="deleteMediaPartner">
                        Yes, Delete</ButtonMerah>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="pdfModal" tabindex="-1" aria-labelledby="pdfModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="pdfModalLabel">Preview File</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <iframe v-if="selectedFileType === 'pdf'" :src="selectedFileUrl" width="100%"
                        height="500px"></iframe>
                    <p class="mt-3">File Name: {{ selectedFileName }}</p>
                </div>
            </div>
        </div>
    </div>
    <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
        <div v-if="isToastVisible"
            :class="['toast', 'align-items-center', 'text-white', toastClass, 'border-0', 'show']" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    {{ toastMessage }}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="closeToast"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>