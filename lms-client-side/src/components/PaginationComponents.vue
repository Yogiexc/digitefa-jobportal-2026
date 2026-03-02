<!-- src/components/Pagination.vue -->
<template>
    <ul class="pagination custom-pagination justify-content-center my-2">
        <!-- Previous Page Button -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>

        <!-- Page Number Buttons -->
        <li v-for="page in pageNumbers" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <a class="page-link" href="#" @click.prevent="goToPage(page)" v-if="page !== '...'">{{ page }}</a>
            <span class="page-link" v-else>...</span>
        </li>

        <!-- Next Page Button -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    </ul>
</template>

<script setup>
import { computed } from 'vue';

// Props yang diterima oleh komponen ini
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    onPageChange: {
        type: Function,
        required: true
    }
});

// Menghitung nomor halaman yang perlu ditampilkan
const pageNumbers = computed(() => {
    const pages = [];
    const total = props.totalPages;

    // Menampilkan halaman yang lebih sedikit jika total halaman kurang dari atau sama dengan 5
    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        if (props.currentPage <= 3) {
            pages.push(1, 2, 3, '...', total);
        } else if (props.currentPage > 3 && props.currentPage < total - 2) {
            pages.push(1, '...', props.currentPage, '...', total);
        } else {
            pages.push(1, '...', total - 2, total - 1, total);
        }
    }
    return pages;
});

// Fungsi untuk berpindah ke halaman lain
const goToPage = (page) => {
    if (page >= 1 && page <= props.totalPages) {
        props.onPageChange(page);
    }
};
</script>