<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    currentPage: Number,
    totalPages: Number
});

const emit = defineEmits(['page-change']);

const changePage = (pageNumber) => {
    emit('page-change', pageNumber);
};
</script>

<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination d-flex justify-content-center">
            <li v-for="page in totalPages" :key="page" :class="['page-item', { active: currentPage === page }]">
                <a class="page-link" href="#" @click.prevent="changePage(page)">
                    {{ page }}
                </a>
            </li>
        </ul>
    </nav>
</template>
