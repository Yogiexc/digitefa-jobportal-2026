module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
    ],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      // Tambahkan rules khusus jika perlu
      'no-unused-vars': 'off', // Nonaktifkan error untuk variabel yang tidak terpakai
        "vue/multi-word-component-names": "off",
        "no-undef": "off"
    },
    globals: {
      defineProps: 'readonly',
      defineEmits: 'readonly',
      defineExpose: 'readonly',
      withDefaults: 'readonly',
    },
  };
  