<template>
    <div>
        <h1>Document View</h1>
        <ul>
            <li v-for="document in documents" :key="document.id">
                {{ document }}
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const documents = ref([]);

        onMounted(async () => {
            const fetchDocuments = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:5000/get_documents');
                    const data = await response.json();
                    documents.value = data.documents;
                } catch (error) {
                    console.error(error);
                }
            };

            fetchDocuments();
        });

        return {
            documents,
        };
    },
};
</script>