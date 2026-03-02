<script setup>

</script>
<template>
    <div>
        <img src="../../../../../../../../assets/images/ak.png" alt="profil" class="rounded-circle mb-4"
            style="width: 100px; height: 100px;">
    </div>
    <div>
        <div class="row mt-3">
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="name" class="form-label mb-0 fs-16">Full Name</label>
                    <input type="text" id="name" class="form-control h-45 fs-14" placeholder="Zaki Abdullah" disabled>
                </div>
                <div class="mb-3">
                    <label for="nohp" class="form-label mb-0 fs-16">No.Telp</label>
                    <input type="text" id="nohp" class="form-control h-45 fs-14" placeholder="0890000000" disabled>
                </div>
                <div class="mb-3">
                    <label for="te" class="form-label mb-0 fs-16">Teaching experience</label>
                    <input type="text" id="te" class="form-control h-45 fs-14" placeholder="Experience" disabled>
                </div>
                <div class="mb-3">
                    <label for="afiliator" class="form-label mb-0 fs-16">Afiliator</label>
                    <input type="text" id="afiliator" class="form-control h-45 fs-14" placeholder="Personal" disabled>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="address" class="form-label mb-0 fs-16">Address</label>
                    <input type="text" id="address" class="form-control h-45 fs-14" placeholder="Surakarta" disabled>
                </div>
                <div class="mb-3">
                    <label for="educationlevel" class="form-label mb-0 fs-16">Education Level</label>
                    <input type="text" id="educationlevel" class="form-control h-45 fs-14" placeholder="D3" disabled>
                </div>
                <div class="mb-3">
                    <label for="notelepon" class="form-label mb-0 fs-16">Areas of expertise</label>
                    <input type="text" id="address" class="form-control h-45 fs-14" placeholder="Web dev, Mobile dev"
                        disabled>
                </div>
                <div class="mb-3 mt-17">
                    <label for="dob" class="form-label mb-0 fs-16">Date of birth</label>
                    <input type="text" id="nohp" class="form-control h-45 fs-14" placeholder="21 Maret 2003" disabled>
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
                                    <th class="fs-16 fw-light w-10">Action</th>
                                </tr>
                            </thead>
                            <tbody class="table-custom">
                                <tr>
                                    <td class="ps-4">1</td>
                                    <td>Cisco</td>
                                    <td class="d-flex justify-content-start">
                                        <img src="../../../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                            class="" style="width: 20px; height: auto;">
                                        <label class="fs-16 ms-2">Sertifikat.pdf</label>
                                    </td>
                                    <td class="ps-3">
                                        <button class="border-0 rounded-2 btn-download">
                                            <i class="bi bi-download"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ps-4">2</td>
                                    <td>Red Hat</td>
                                    <td class="d-flex justify-content-start">
                                        <img src="../../../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                            class="" style="width: 20px; height: auto;">
                                        <label class="fs-16 ms-2">Sertifikat.pdf</label>
                                    </td>
                                    <td class="ps-3">
                                        <button class="border-0 rounded-2 btn-download">
                                            <i class="bi bi-download"></i>
                                        </button>
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
                            <div class="card text-center border-c p-2" style="width: 120px; min-height: 130px;">
                                <div class="card-body c-default">
                                    <img src="../../../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                        class="mx-auto d-block" style="width: 50px; height: auto;">
                                </div>
                                <div class="d-flex flex-column align-items-center">
                                    <label class="fs-12 opacity-75">data.pdf</label>
                                    <label class="fs-12 opacity-75">(200 KB)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mt-4">
                        <label for="portfolio" class="fs-16 mb-0">Verifikasi Identitas</label>
                        <div class="card text-center border-c p-2" style="width: 120px; min-height: 130px;">
                            <div class="card-body c-default">
                                <img src="../../../../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon"
                                    class="mx-auto d-block" style="width: 50px; height: auto;">
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <label class="fs-12 opacity-75">data.pdf</label>
                                <label class="fs-12 opacity-75">(200 KB)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>