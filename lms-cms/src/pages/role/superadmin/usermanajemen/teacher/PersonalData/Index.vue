<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import ButtonBiru from '@/components/ButtonBiru.vue';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import * as bootstrap from 'bootstrap';

const route = useRoute();
const router = useRouter();
const isEditing = ref(false);
const isHovered = ref(false);
const imagePreview = ref(null);
const teacherData = ref([]);
const selectedFileUrl = ref('');
const selectedFileType = ref('');
const selectedFileName = ref('');
const selectedFileSize = ref('');
const areaofexpertiseOptions = ref([]);
const selectedAreas = ref([]);

const form = ref({
    email: '',
    name: '',
    phone_number: '',
    year_of_experience: '',
    affiliation: '',
    photo_profile: '',
    address: '',
    education: '',
    categories: '',
    date_of_birth: null,
    portofolio: null,
    identity: null,
    certificates: [],
});

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

const fetchTeacherData = async () => {
    const id = route.params.id;
    try {
        const response = await axios.get(`/users/${id}`);
        // url gambar
        const teacherIdentityUrl = process.env.VUE_APP_TEACHER_IDENTITY_URL;
        const teacherPortofolioUrl = process.env.VUE_APP_TEACHER_PORTOFOLIO_URL;
        const teacherProfileUrl = process.env.VUE_APP_TEACHER_PROFILE_URL;
        const teacherCertificatesUrl = process.env.VUE_APP_TEACHER_CERTIFICATE_URL;

        const userData = response.data.user;
        form.value.name = userData.name;
        form.value.address = userData.teacher.address;
        form.value.phone_number = userData.teacher.phone_number;
        form.value.year_of_experience = userData.teacher.year_of_experience;
        form.value.education = userData.teacher.education;
        form.value.affiliation = userData.teacher.affiliation;
        form.value.date_of_birth = userData.teacher.date_of_birth;
        form.value.categories = userData.teacher?.categories_teacher?.map(cat => cat.name).join(', ') || '';
        form.value.preselectedItems = userData.teacher.categories_teacher;

        selectedAreas.value = userData.teacher.categories_teacher.map(cat => ({
            label: cat.name,  // nama kategori
            value: cat.id_category  // id kategori
        }));

        form.value.photo_profile = userData.teacher.photo_profile
            ? `${teacherProfileUrl}/${userData.teacher.photo_profile}`
            : require('@assets/images/avatar.png');
        if (userData.teacher.portofolio) {
            const fileUrl = `${teacherPortofolioUrl}/${userData.teacher.portofolio}`;
            form.value.portofolio = {
                url: fileUrl,
                name: userData.teacher.portofolio,
            };
        }

        if (userData.teacher.identity) {
            const fileUrl = `${teacherIdentityUrl}/${userData.teacher.identity}`;
            form.value.identity = {
                url: fileUrl,
                name: userData.teacher.identity,
            };
        }

        form.value.certificates = userData.teacher.teacher_certificates.map((certificate) => ({
            id: certificate.id_teacher_certificate,
            name: certificate.file,
            url: `${teacherCertificatesUrl}/${certificate.file}`,
            title: certificate.name
        }));
    } catch (error) {
        console.error('Error fetching data for edit:', error);
    }
};

const submitFormEdit = async () => {
    const id = route.params.id;
    try {
        const formData = new FormData();
        formData.append('email', form.value.email);
        formData.append('name', form.value.name);
        formData.append('address', form.value.address);
        formData.append('phone_number', form.value.phone_number);
        formData.append('year_of_experience', form.value.year_of_experience);
        formData.append('education', form.value.education);
        formData.append('affiliation', form.value.affiliation);
        formData.append('date_of_birth', form.value.date_of_birth);

        selectedAreas.value.forEach((area) => {
            formData.append('categories[]', area.value);
        });

        if (imagePreview.value) {
            formData.append('photo_profile', document.getElementById('fileInput').files[0]);
        }

        await axios.post(`/teachers/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        await fetchTeacherData();
    } catch (error) {
        console.log(error)
    }
};

const toggleEditMode = () => {
    if (isEditing.value) {
        submitFormEdit();
    }
    isEditing.value = !isEditing.value;
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
    }
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

const zoomFile = (type) => {
    let selectedFile = null;

    if (type === 'portofolio') {
        selectedFile = form.value.portofolio;
    } else if (type === 'identity') {
        selectedFile = form.value.identity;
    }

    if (selectedFile) {
        selectedFileUrl.value = selectedFile.url;
        selectedFileType.value = 'pdf';
        selectedFileName.value = selectedFile.name;
        selectedFileSize.value = selectedFile.size;

        const myModal = new bootstrap.Modal(document.getElementById('pdfModal'));
        myModal.show();
    }
};


onMounted(() => {
    fetchTeacherData();
    fetchCategoryData();
});
</script>
<template>
    <div v-if="isEditing">
        <div class="d-flex justify-content-start">
            <div class="position-relative me-3" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
                <img v-if="imagePreview || form.photo_profile" :src="imagePreview || form.photo_profile" alt="Profile"
                    class="rounded-circle profil-teacher" style="width: 100px; height: 100px;" />
                <img v-else :src="require('@assets/images/ak.png')" alt="Profile" class="rounded-circle profil-teacher"
                    style="width: 100px; height: 100px;" />
                <input type="file" id="fileInput" hidden accept="image/*" @change="handleFile" />
                <div v-show="isHovered">
                    <div class="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center"
                        style="width: 50px; height: 50px; background: rgba(0, 0, 0, 0.5); border-radius: 50%;">
                        <button type="button" class="btn p-0 text-white" @click="triggerFileInput">
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
    </div>
    <div v-else>
        <img v-if="form.photo_profile" :src="form.photo_profile" alt="Profile" class="rounded-circle mb-2"
            style="width: 100px; height: 100px;">
        <span v-else>No Profile Picture</span>
    </div>
    <div class="d-flex justify-content-end">
        <ButtonBiru @click="toggleEditMode" class="ms-3 h-40 px-3 rounded-3 fs-16">
            <i class="bi bi-pencil-square me-1 fs-16"></i>
            {{ isEditing ? 'Save' : 'Edit' }}
        </ButtonBiru>
    </div>
    <div v-if="isEditing">
        <form @submit.prevent="submitFormEdit">
            <div class="row mt-3">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="name" class="form-label mb-0 fs-16">Full Name</label>
                        <input type="text" id="name" class="form-control h-45 fs-14" placeholder="Enter your name here"
                            v-model="form.name">
                    </div>
                    <div class="mb-3">
                        <label for="nohp" class="form-label mb-0 fs-16">No.Telp</label>
                        <input type="text" id="nohp" class="form-control h-45 fs-14"
                            placeholder="Enter your no telepon here" v-model="form.phone_number">
                    </div>
                    <div class="mb-3">
                        <label for="name5" class="form-label mb-0 fs-16">Teaching experience</label>
                        <select class="form-select w-100 h-45 fs-14 opacity-75" v-model="form.year_of_experience">
                            <option value="1-3">1-3 Years</option>
                            <option value="4-6">4-6 Years</option>
                            <option value="7+">7+ Years</option>
                        </select>
                    </div>
                    <div class="mb-3 mt-17">
                        <label for="name6" class="form-label mb-0 fs-16">Affiliate</label>
                        <input type="text" id="affiliate" class="form-control h-45 fs-14"
                            placeholder="Enter the affiliate name here" v-model="form.affiliation">
                    </div>
                </div>
                <div class="col-md-6 pd">
                    <div class="mb-3">
                        <label for="notelepon" class="form-label mb-0 fs-16">Address</label>
                        <input type="text" id="address" class="form-control h-45 fs-14"
                            placeholder="Enter your address here" v-model="form.address">
                    </div>
                    <div>
                        <label for="name4" class="form-label mb-0 fs-16">Education Level</label>
                        <select class="form-select w-100 h-45 fs-14 opacity-75" v-model="form.education">
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
                        <input type="date" id="nohp" class="form-control opacity-75 h-45 fs-14"
                            v-model="form.date_of_birth">
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
                                    <tr v-for="(certificate, index) in form.certificates" :key="certificate.id">
                                        <td class="ps-4 pt-3">{{ index + 1 }}</td>
                                        <td class="pt-3">{{ certificate.title }}</td>
                                        <td class="d-flex justify-content-start">
                                            <img :src="require('@assets/images/svg/pdf-file.svg')" alt="PDF Icon"
                                                class="" style="width: 20px; height: auto;">
                                            <a :href="certificate.url" target="_blank" class="fs-16 ms-1">{{
                                                certificate.name
                                            }}</a>
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
                        <div class="col-md-6">
                            <div class="mt-4">
                                <label for="portfolio" class="fs-16 mb-0">Portofolio</label>
                                <div v-if="form.portofolio" class="card text-center border-c p-2"
                                    style="width: 170px; min-height: 220px;">
                                    <div class="card-body c-default">
                                        <img src="../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                            class="mx-auto d-block" style="width: 70px; height: auto;">
                                    </div>
                                    <div class="d-flex flex-column align-items-center">
                                        <label class="fs-12 opacity-75">{{ form.portofolio.name }}</label>
                                    </div>
                                    <div class="d-flex justify-content-end gap-2 mt-2 bottom-right c-pointer fs-12">
                                        <div class="rounded-1"
                                            style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                            <i class="bi bi-zoom-in" @click="zoomFile('portofolio')"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mt-4">
                            <label for="portfolio" class="fs-16 mb-0">Verifikasi Identitas</label>
                            <div v-if="form.identity" class="card text-center border-c p-2"
                                style="width: 170px; min-height: 220px;">
                                <div class="card-body c-default">
                                    <img src="../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                        class="mx-auto d-block" style="width: 70px; height: auto;">
                                </div>
                                <div class="d-flex flex-column align-items-center">
                                    <label class="fs-12 opacity-75">{{ form.identity.name }}</label>
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
        <div class="row mt-3">
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="name" class="form-label mb-0 fs-16">Full Name</label>
                    <input type="text" id="name" class="form-control h-45 fs-14" v-model="form.name" disabled>
                </div>
                <div class="mb-3">
                    <label for="nohp" class="form-label mb-0 fs-16">No.Telp</label>
                    <input type="text" id="nohp" class="form-control h-45 fs-14" v-model="form.phone_number" disabled>
                </div>
                <div class="mb-3">
                    <label for="te" class="form-label mb-0 fs-16">Teaching experience</label>
                    <input type="text" id="te" class="form-control h-45 fs-14" v-model="form.year_of_experience"
                        disabled>
                </div>
                <div class="mb-3">
                    <label for="afiliator" class="form-label mb-0 fs-16">Affiliate</label>
                    <input type="text" id="afiliator" class="form-control h-45 fs-14" v-model="form.affiliation"
                        disabled>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="address" class="form-label mb-0 fs-16">Address</label>
                    <input type="text" id="address" class="form-control h-45 fs-14" v-model="form.address" disabled>
                </div>
                <div class="mb-3">
                    <label for="educationlevel" class="form-label mb-0 fs-16">Education Level</label>
                    <input type="text" id="educationlevel" class="form-control h-45 fs-14" v-model="form.education"
                        disabled>
                </div>
                <div class="mb-3">
                    <label for="notelepon" class="form-label mb-0 fs-16">Areas of expertise</label>
                    <input type="text" id="address" class="form-control h-45 fs-14" v-model="form.categories" disabled>
                </div>
                <div class="mb-3 mt-17">
                    <label for="dob" class="form-label mb-0 fs-16">Date of birth</label>
                    <input type="text" id="nohp" class="form-control h-45 fs-14" v-model="form.date_of_birth" disabled>
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
                                <tr v-for="(certificate, index) in form.certificates" :key="certificate.id">
                                    <td class="ps-4 pt-3">{{ index + 1 }}</td>
                                    <td class="pt-3">{{ certificate.title }}</td>
                                    <td class="d-flex justify-content-start">
                                        <img src="../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                            class="" style="width: 20px; height: auto;">
                                        <a :href="certificate.url" target="_blank" class="fs-16 ms-1">{{
                                            certificate.name
                                        }}</a>
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
                    <div class="col-md-6">
                        <div class="mt-4">
                            <label for="portfolio" class="fs-16 mb-0">Portofolio</label>
                            <div v-if="form.portofolio" class="card text-center border-c p-2"
                                style="width: 170px; min-height: 220px;">
                                <div class="card-body c-default">
                                    <img src="../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                        class="mx-auto d-block" style="width: 70px; height: auto;">
                                </div>
                                <div class="d-flex flex-column align-items-center">
                                    <label class="fs-12 opacity-75">{{ form.portofolio.name }}</label>
                                </div>
                                <div class="d-flex justify-content-end gap-2 mt-2 bottom-right c-pointer fs-12">
                                    <div class="rounded-1" style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                        <i class="bi bi-zoom-in" @click="zoomFile('portofolio')"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mt-4">
                        <label for="portfolio" class="fs-16 mb-0">Verifikasi Identitas</label>
                        <div v-if="form.identity" class="card text-center border-c p-2"
                            style="width: 170px; min-height: 220px;">
                            <div class="card-body c-default">
                                <img src="../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                    class="mx-auto d-block" style="width: 70px; height: auto;">
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <label class="fs-12 opacity-75">{{ form.identity.name }}</label>
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
                    <p>File Size: {{ selectedFileSize }}</p>
                </div>
            </div>
        </div>
    </div>
</template>