<template>
  <div class="multiselect-component" ref="multiselectRef">
    <div class="multiselect-container form-select h-43 rounded-2" @click="toggleDropdown"
      :class="{ 'focused': isOpen }" tabindex="0">
      <div class="selected-items opacity-75">
        <span v-for="(item, index) in visibleSelectedItems" :key="index" class="selected-item">
          {{ truncatedLabel(item.label) }}
          <span class="remove-item" @click.stop="removeItem(item)">×</span>
        </span>
        <span v-if="remainingItemCount > 0" class="more-items">
          +{{ remainingItemCount }} More
        </span>
      </div>
      <div v-if="!selectedItems.length && placeholder" class="placeholder-and-arrow opacity-75">
        <!-- Placeholder -->
        <span class="placeholder">
          {{ placeholder }}
        </span>
      </div>
    </div>
    <div v-if="isOpen" class="dropdown">
      <input type="text" v-model="searchTerm" placeholder="Search..." class="search-input" />
      <ul>
        <li v-for="item in filteredOptions" :key="item.value" :class="{ 'is-selected': isSelected(item) }"
          @click="toggleSelection(item)">
          <input type="checkbox" class="form-check-input mt--3 me-3" :checked="isSelected(item)" />
          <span class="opacity-75"> {{ item.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
});

const isOpen = ref(false);
const searchTerm = ref('');
const multiselectRef = ref(null);
const multiselectWidth = ref(0);

const selectedItems = ref([...props.modelValue]);

watch(() => props.modelValue, (newValue) => {
  selectedItems.value = [...newValue]; // Update selectedItems ketika modelValue berubah
}, { immediate: true });


const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const isSelected = (item) => selectedItems.value.some((selected) => selected.value === item.value);

const toggleSelection = (item) => {
  if (isSelected(item)) {
    selectedItems.value = selectedItems.value.filter((selected) => selected.value !== item.value);
    item.selected = false;  // Mark as deselected
  } else {
    selectedItems.value.push(item);
    item.selected = true;  // Mark as selected
  }
  emit('update:modelValue', selectedItems.value);
};

const removeItem = (item) => {
  selectedItems.value = selectedItems.value.filter((selected) => selected.value !== item.value);
  item.selected = false;  // Mark as deselected
};

const filteredOptions = computed(() => {
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const truncatedLabel = (label) => {
  return multiselectWidth.value < 240
    ? label.length > 4 ? label.slice(0, 4) + '...' : label
    : label.length > 10 ? label.slice(0, 10) + '...' : label;
};

const visibleSelectedItems = computed(() => {
  return multiselectWidth.value < 370
    ? selectedItems.value.slice(0, 1)
    : selectedItems.value.slice(0, 2);
});

const remainingItemCount = computed(() => {
  return multiselectWidth.value < 360
    ? selectedItems.value.length > 1
      ? selectedItems.value.length - 1
      : 0
    : selectedItems.value.length > 2
    ? selectedItems.value.length - 2
    : 0;
});

const handleClickOutside = (event) => {
  if (multiselectRef.value && !multiselectRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

const updateWidth = () => {
  if (multiselectRef.value) {
    multiselectWidth.value = multiselectRef.value.offsetWidth;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', updateWidth);
  updateWidth();
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updateWidth);
});
</script>

<style scoped>
.multiselect-component {
  width: 100%;
  position: relative;
}

.multiselect-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
  border: 1px solid #bbbbbb;
  border-radius: 8px;
  cursor: pointer;
  width: 50%;
  height: 43px;
  position: relative;
}

.body-login-profile .multiselect-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
  border: 1px solid #dfdede;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  height: 44px;
  position: relative;
}
.body-login-profile .placeholder {
  color: #0f2239;
  font-size: 16px;
  margin-right: auto;
  font-size: 14px;
  display: flex;
  min-height: auto;
  vertical-align: baseline;
  cursor: default !important;
  /* Menghilangkan tanda tunggu */
  background-color: transparent !important;
  opacity: 1 !important;
}
.body-login-profile .dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #dfdede;
  border-radius: 4px;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
  padding: 8px;
}

.my .multiselect-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
  border: 1px solid #dfdede;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  height: 44px;
  position: relative;
}
.my .placeholder {
  color: #0f2239;
  font-size: 16px;
  margin-right: auto;
  font-size: 14px;
  display: flex;
  min-height: auto;
  vertical-align: baseline;
  cursor: default !important;
  /* Menghilangkan tanda tunggu */
  background-color: transparent !important;
  opacity: 1 !important;
}
.my .dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #dfdede;
  border-radius: 4px;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
  padding: 8px;
}

.pd .multiselect-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
  border: 1px solid #dfdede;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  height: 44px;
  position: relative;
}
.pd .placeholder {
  color: #0f2239;
  font-size: 16px;
  margin-right: auto;
  font-size: 14px;
  display: flex;
  min-height: auto;
  vertical-align: baseline;
  cursor: default !important;
  /* Menghilangkan tanda tunggu */
  background-color: transparent !important;
  opacity: 1 !important;
}
.pd .dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #dfdede;
  border-radius: 4px;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
  padding: 8px;
}

.selected-items {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.selected-item {
  background-color: rgba(231, 244, 254, 0.8);
  color: #0f2239;
  padding: 4px 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.remove-item {
  margin-left: 4px;
  cursor: pointer;
  color: #007bff;
}

.placeholder-and-arrow {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.placeholder {
  color: #0f2239;
  font-size: 16px;
  margin-right: auto;
  /* Memastikan placeholder tetap berada di sebelah kiri */
  display: flex;
  min-height: auto;
  vertical-align: baseline;
  cursor: default !important;
  /* Menghilangkan tanda tunggu */
  background-color: transparent !important;
  opacity: 1 !important;
}

.arrow {
  display: flex;
  align-items: center;
}

.more-items {
  background-color: rgba(231, 244, 254, 0.8);
  color: #0f2239;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 16px;
  margin-left: auto;
  margin-right: 20px;
}

.dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 50%;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
  padding: 8px;
}


.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown li {
  padding: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown li.is-selected {
  background-color: rgba(231, 244, 254, 0.8);
}

.dropdown li input[type='checkbox'] {
  margin-right: 8px;
  transform: scale(1.5);
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #bbbbbb;
  border-radius: 4px;
}
</style>