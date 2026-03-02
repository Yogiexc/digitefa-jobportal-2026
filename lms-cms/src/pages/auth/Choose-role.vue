<template>
    <div class="body-login d-flex justify-content-center align-items-center">
        <a href="/" class="icon-back">
            <i class="bi bi-chevron-left"></i>
        </a>
        <div class="container text-center">
            <div class="row mtc">
                <h4 class="fw-semibold fs-26 mb-4 animate__animated animate__zoomIn">Choose Your Role: Teacher or Student</h4>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-3 mb-3 animate__animated animate__fadeInLeft animate__delay-1s">
                    <a href="/login" class="garis-">
                        <div class="card rounded-4 pointer custom-shadow border-0 bg-login p-25">
                            <img src="../../assets/images/student.png" alt="student" class="" />
                            <p class="fw-medium fs-14 mt-4 mb-0">"Log in as a Student to continue learning!"</p>
                        </div>
                    </a>
                </div>
                <div class="col-md-3 animate__animated animate__fadeInRight animate__delay-1s">
                    <a href="/login-teacher" class="garis-">
                        <div class="card rounded-4 pointer custom-shadow border-0 bg-login p-25">
                            <img src="../../assets/images/teacher.png" alt="">
                            <p class="fw-medium fs-14 mt-4 mb-0">"Log in as a Teacher to guide your students."</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
