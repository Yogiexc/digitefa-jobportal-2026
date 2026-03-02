<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ButtonBiru from '@/components/ButtonBiru.vue';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import * as bootstrap from 'bootstrap';
import ButtonPutih from '@/components/ButtonPutih.vue';
import { event } from 'jquery';
import { getFromDB } from '@/utils/indexedDB';

const selectedFileUrl = ref('');
const selectedFileType = ref('');
const router = useRouter();
const store = useStore();
const isHovered = ref(false);
const imagePreview = ref(null);
const fileInput = ref(null)
const portofolioFile = ref(null);
const portofolioInputRef = ref(null);
const identityInputRef = ref(null);
const identityFile = ref(null);
const isModalVisible = ref(false);
const certificate = ref(null);
const certificateFile = ref(null);
const certificateInputRef = ref(null);
const selectedFileName = ref('');
const address = ref('');
const bio = ref('');
const date_of_birth = ref('');
const education = ref('diploma');
const year_of_experience = ref('1-3');
const phone_number = ref('');
const affiliation = ref('');
const name = ref('');
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('');
const photo_profile = ref(null);
const portofolio = ref(null);
const identity = ref(null);
const selectedAreas = ref([]);
const areaofexpertiseOptions = ref([]);


const form = ref({
    certificates: []
});

const newCertificate = ref({
    name: '',
    file: null
});

const Logout = (event) => {
    event.preventDefault();
    store.dispatch('logout').then(() => {
        router.push('/');
    }).catch((error) => {
        console.error('Logout failed', error);
    });
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

const handleFileUpload = (fieldName, event) => {
    const file = event.target.files[0];
    if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            message.value = 'Invalid file format. Please upload a .jpg, .png or .jpeg file.';
            messageType.value = 'error';
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            message.value = 'File size exceeds 2MB.';
            messageType.value = 'error';
            return;
        }
        photo_profile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};


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

const zoomFile = (type) => {
    if (type === 'portofolio' && portofolioFile.value) {
        selectedFileUrl.value = portofolioFile.value.url;
        selectedFileType.value = 'pdf';
        selectedFileName.value = portofolioFile.value.name;
    } else if (type === 'identity' && identityFile.value) {
        selectedFileUrl.value = identityFile.value.url;
        selectedFileType.value = 'pdf';
        selectedFileName.value = identityFile.value.name;
    } else if (type === 'certificate' && certificateFile.value) {
        selectedFileUrl.value = certificateFile.value.url;
        selectedFileType.value = 'pdf';
        selectedFileName.value = certificateFile.value.name;
    }

    const myModal = new bootstrap.Modal(document.getElementById('pdfModal'));
    myModal.show();
};

const deleteCertificate = (index) => {
    form.value.certificates.splice(index, 1);
};


const triggerFileInput = (type) => {
    if (type === 'portofolio' && portofolioInputRef.value) {
        portofolioInputRef.value.click();
    } else if (type === 'identity' && identityInputRef.value) {
        identityInputRef.value.click();
    } else if (type === 'certificate' && certificateInputRef.value) {
        certificateInputRef.value.click();
    }
};

onMounted( async () => {
    const userData = await getFromDB('users', 'id_user');
    const user = userData || null;

    if (user) {
        name.value = user.name;
    }
    fetchCategoryData();
});

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


const handleSubmit = async () => {
    isSubmitting.value = true;
    message.value = '';

    const user = await getFromDB('users', 'id_user');
    const token = await getFromDB('settings', 'token');

    if (!user || !token) {
        message.value = 'You are not authorized. Please login again.';
        messageType.value = 'error';
        router.push('/');
        return;
    }

    const formData = new FormData();

    formData.append('address', address.value);
    formData.append('bio', bio.value);
    formData.append('date_of_birth', date_of_birth.value);
    formData.append('education', education.value);
    formData.append('year_of_experience', year_of_experience.value);
    formData.append('phone_number', phone_number.value);
    formData.append('affiliation', affiliation.value);
    formData.append('name', name.value);

    selectedAreas.value.forEach((category, index) => {
        formData.append('categories[]', category.value);
    });

    form.value.certificates.forEach((cert, index) => {
        formData.append(`certificates[${index}][name]`, cert.name);
        formData.append(`certificates[${index}][file]`, cert.file);
    });

    if (photo_profile.value) {
        formData.append('photo_profile', photo_profile.value);
    }
    if (portofolio.value) {
        formData.append('portofolio', portofolio.value);
    }
    if (identity.value) {
        formData.append('identity', identity.value);
    }

    try {
        const response = await axios.post(
            `/teachers/${user.id_user}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        message.value = response.data.message;
        messageType.value = 'success';

        setTimeout(() => {
            router.push('/checking-account');
        }, 1500);
        console.log
    } catch (error) {
        message.value = error.response?.data?.message || 'Profile update failed. Please try again.';
        messageType.value = 'error';
    } finally {
        isSubmitting.value = false;
    }
};
</script>


<template>
    <div class="body-login-profile">
        <div class="col-md-8 offset-md-2">
            <div class="card border-0 p-5 my-5 shadow">
                <form @submit.prevent="handleSubmit">
                    <div class="d-flex justify-content-start">
                        <div class="position-relative me-3" @mouseenter="isHovered = true"
                            @mouseleave="isHovered = false">
                            <img v-if="!imagePreview" src="../../assets/images/profil-bg.png" alt="Profile"
                                class="rounded-circle profil-teacher" />
                            <img v-if="imagePreview" :src="imagePreview" alt="Image Preview"
                                class="rounded-circle profil-teacher" />
                            <input type="file" ref="fileInput" id="fileInput" class="hidden" accept="image/*"
                                @change="handleFileUpload('photo_profile', $event)" />
                            <div v-show="isHovered">
                                <div class="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center"
                                    style="width: 50px; height: 50px; background: rgba(0, 0, 0, 0.5); border-radius: 50%;">
                                    <button type="button" class="btn p-0 text-white" @click="() => fileInput.click()">
                                        <i class="bi bi-pencil-square fs-5"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 fs-12 opacity-75">
                            <label>Max file size : 2Mb</label> <br>
                            <label>Format : .jpg, .png , .jpeg</label>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="name" class="form-label mb-0 fs-16">Full Name</label>
                                <input type="text" id="name" class="form-control h-45 fs-14"
                                    placeholder="Enter your name here" v-model="name" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="nohp" class="form-label mb-0 fs-16">No.Telp</label>
                                <input type="number" id="nohp" class="form-control h-45 fs-14"
                                    placeholder="Enter your no telepon here" v-model="phone_number">
                            </div>
                            <div class="mb-3">
                                <label for="name5" class="form-label mb-0 fs-16">Teaching experience</label>
                                <select class="form-select w-100 h-45 fs-14 opacity-75" v-model="year_of_experience"
                                    required>
                                    <option value="1-3">1-3 Years</option>
                                    <option value="4-6">4-6 Years</option>
                                    <option value="7+">7+ Years</option>
                                </select>
                            </div>
                            <div class="mb-3 mt-17">
                                <label for="affiliation" class="form-label mb-0 fs-16">Affiliation</label>
                                <input type="text" id="affiliation" class="form-control h-45 fs-14"
                                    placeholder="Enter affiliation here" v-model="affiliation">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="notelepon" class="form-label mb-0 fs-16">Address</label>
                                <input type="text" id="address" class="form-control h-45 fs-14"
                                    placeholder="Enter your address here" v-model="address">
                            </div>
                            <div>
                                <label for="name4" class="form-label mb-0 fs-16">Education Level</label>
                                <select class="form-select w-100 h-45 fs-14 opacity-75" v-model="education" required>
                                    <option value="diploma">Diploma</option>
                                    <option value="sarjana">Sarjana</option>
                                </select>
                            </div>
                            <div class="mb-3 mt-17">
                                <label for="name6" class="form-label mb-0 fs-16">Areas of expertise</label>
                                <MultipleSelect :options="areaofexpertiseOptions" v-model="selectedAreas"
                                    placeholder="Select area of expertise" />
                            </div>
                            <div class="mb-3 mt-17">
                                <label for="name6" class="form-label mb-0 fs-16">Date of birth</label>
                                <input type="date" id="date_of_birth" class="form-control opacity-75 h-45 fs-14"
                                    v-model="date_of_birth">
                            </div>
                        </div>
                    </div>
                    <label for="" class="d-flex align-items-center fs-16">Sertifikasi</label>
                    <div class="card p-2">
                        <div class="d-flex justify-content-end">
                            <ButtonBiru class="fs-16 h-40 my-2" type="button" @click="showAddCertificateModal">Add
                                Sertifikasi
                            </ButtonBiru>
                        </div>
                        <div class="table-responsive">
                            <table class="table custom-table rounded-4">
                                <thead class="thead-custom">
                                    <tr class="ps-4">
                                        <th class="ps-3 fs-16 fw-light w-1">No</th>
                                        <th class="fs-16 fw-light w-330">Nama Sertifikat</th>
                                        <th class="fs-16 fw-light w-300">File</th>
                                        <th class="fs-16 fw-light w-10">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="table-custom">
                                    <tr v-for="(certificate, index) in form.certificates" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ certificate.name }}</td>
                                        <td class="justify-content-start">
                                            <a :href="certificate.fileUrl" target="_blank" class="text-decoration-none">
                                                {{ certificate.fileName }}
                                            </a>
                                        </td>
                                        <td>
                                            <button class="border-0 rounded-2 btn-trash"
                                                @click="deleteCertificate(index)">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-if="!form.certificates.length">
                                        <td colspan="4" class="text-center">No certificates added.</td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" class="p-1">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mt-3">
                                <label for="portofolio" class="fs-16 mb-0">Portofolio</label>
                                <div v-if="portofolioFile" class="card text-center border-c p-2"
                                    style="width: 170px; min-height: 220px;">
                                    <div class="card-body c-default">
                                        <img src="../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                            class="mx-auto d-block" style="width: 70px; height: auto;">
                                    </div>
                                    <div class="d-flex flex-column align-items-center">
                                        <label class="fs-12 opacity-75">{{ portofolioFile.name }}</label>
                                        <label class="fs-12 opacity-75">({{ portofolioFile.size }} KB)</label>
                                    </div>
                                    <div class="d-flex justify-content-end gap-2 mt-2 bottom-right c-pointer fs-12">
                                        <div class="rounded-1"
                                            style="padding: 2px 4px 2px 4px; border: 1px solid #ccc;">
                                            <i class="bi bi-trash3" @click="removeFile('portofolio')"></i>
                                        </div>
                                        <div class="rounded-1"
                                            style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                            <i class="bi bi-zoom-in" @click="zoomFile('portofolio')"></i>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <input type="file" ref="portofolioInputRef" class="hidden" accept="application/pdf"
                                        @change="handleFileUpload2('portofolio', $event)" />
                                    <button type="button" class="btn btn-border opacity-75 px-5 py-2 mt-0 mb-1"
                                        @click="triggerFileInput('portofolio')">Upload</button>
                                </div>
                                <div class="opacity-75 fs-12">
                                    <p class="mb-0">Max file size: 15MB</p>
                                    <p>Format: .pdf</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mt-3">
                                <label for="identity" class="fs-16 mb-0">Verifikasi Identitas</label>
                                <div v-if="identityFile" class="card text-center border-c p-2"
                                    style="width: 170px; min-height: 220px;">
                                    <div class="card-body c-default">
                                        <img src="../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                            class="mx-auto d-block" style="width: 70px; height: auto;">
                                    </div>
                                    <div class="d-flex flex-column align-items-center">
                                        <label class="fs-12 opacity-75">{{ identityFile.name }}</label>
                                        <label class="fs-12 opacity-75">({{ identityFile.size }} KB)</label>
                                    </div>
                                    <div class="d-flex justify-content-end gap-2 mt-2 bottom-right c-pointer fs-12">
                                        <div class="rounded-1"
                                            style="padding: 2px 4px 2px 4px; border: 1px solid #ccc;">
                                            <i class="bi bi-trash3" @click="removeFile('identity')"></i>
                                        </div>
                                        <div class="rounded-1"
                                            style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                            <i class="bi bi-zoom-in" @click="zoomFile('identity')"></i>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <input type="file" ref="identityInputRef" class="hidden" accept="application/pdf"
                                        @change="handleFileUpload2('identity', $event)" />
                                    <button type="button" class="btn btn-border opacity-75 px-5 py-2 mt-0 mb-1"
                                        @click="triggerFileInput('identity')">Upload</button>
                                </div>
                                <div class="opacity-75 fs-12">
                                    <p class="mb-0">Max file size: 15MB</p>
                                    <p>Format: .pdf</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between gap-2">
                        <ButtonPutih class="fs-16 h-40 mt-4 w-50" @click="Logout">Cancel</ButtonPutih>
                        <ButtonBiru class="fs-16 h-40 mt-4 w-50" type="submit" :disabled="isSubmitting">Submit
                        </ButtonBiru>
                    </div>
                </form>
                <p v-if="message" :style="{ color: messageType === 'success' ? 'green' : 'red' }">
                    {{ message }}
                </p>
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
                        <button type="button" class="btn-close fs-12 c-close"
                            @click="closeAddCertificateModal"></button>
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
                                        <img src="../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
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
                        <p v-if="selectedFileType === 'doc'">This is a DOC file: {{ selectedFileName }}</p>
                        <img v-if="selectedFileType === 'png' || selectedFileType === 'jpeg'" :src="selectedFileUrl"
                            alt="Image" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>