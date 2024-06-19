<template>
    <div class="container">
        <br />
        <div class="input-group">
            <span class="input-group-text">請輸入知識</span>
            <textarea class="form-control" v-model="text" placeholder="Type here..."></textarea>
            <button class="btn btn-outline-secondary" @click="saveDocument">儲存到後端資料庫</button>
        </div>
        <div class="input-group">
            <input type="text" v-model="filter" class="form-control" placeholder="Search by keyword...">
        </div>
        <div v-for="document in filteredDocuments" :key="document" class="card m-2">
            <div class="card-body">
                <div>
                    <textarea v-if="editDocumentContent === document" class="form-control edit-content" v-model="editText"></textarea>
                    <vue-markdown v-else :source="document" />
                </div>
                <div class="btn-group">
                    <button v-if="editDocumentContent === document" class="btn btn-outline-success btn-lg" @click="updateDocument">更新</button>
                    <button v-else class="btn btn-outline-primary btn-lg" @click="() => editDocument(document)">編輯</button>
                    <button class="btn btn-outline-danger btn-lg" @click="() => deleteDocument(document)">刪除</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, onMounted, computed } from 'vue';
import VueMarkdown from 'vue-markdown-render'

export default {
    setup() {
        const documents = ref([]);
        const text = ref('');
        const filter = ref('');
        const editText = ref('');
        const editDocumentContent = ref(null); // This will hold the content of the document being edited

        const fetchDocuments = async () => {
            try {
                const response = await fetch('http://127.0.0.1:6500/get_documents');
                if (response.ok) {
                    const data = await response.json();
                    documents.value = data.documents;
                } else {
                    throw new Error('Failed to fetch documents');
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        const saveDocument = async () => {
            try {
                const response = await fetch('http://127.0.0.1:6500/add_document', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: text.value })
                });
                if (response.ok) {
                    text.value = '';
                    await fetchDocuments();
                } else {
                    console.error('Failed to save document:', await response.json());
                }
            } catch (error) {
                console.error('Error saving document:', error);
            }
        };

        const updateDocument = async () => {
            if (editDocumentContent.value) {
                try {
                    const oldContent = editDocumentContent.value;
                    const response = await fetch('http://127.0.0.1:6500/update_document', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ old_content: oldContent, new_content: editText.value })
                    });
                    if (response.ok) {
                        editDocumentContent.value = null;
                        editText.value = '';
                        await fetchDocuments();
                    } else {
                        console.error('Failed to update document:', await response.json());
                    }
                } catch (error) {
                   console.error('Error updating document:', error);
                }
            }
        };

        const editDocument = (content) => {
            editDocumentContent.value = content;
            editText.value = content;
        };

        const deleteDocument = async (content) => {
            try {
                const response = await fetch('http://127.0.0.1:6500/delete_document', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: content })
                });
                if (response.ok) {
                    await fetchDocuments();
                } else {
                    console.error('Failed to delete document:', await response.json());
                }
            } catch (error) {
                console.error('Error deleting document:', error);
            }
        };

        const filteredDocuments = computed(() => {
            return documents.value.filter(document => document.toLowerCase().includes(filter.value.toLowerCase()));
        });

        onMounted(fetchDocuments);

        return {
            documents,
            text,
            filter,
            editText,
            editDocumentContent,
            saveDocument,
            updateDocument,
            editDocument,
            deleteDocument,
            filteredDocuments
        };
    },
    components: {
        VueMarkdown
    },
};
</script>


<style>
/* Add your custom styles here */
.container {
    padding: 20px;
}
.input-group-text, .form-control, .btn {
    margin-bottom: 10px;
}
.card {
    margin: 10px 0;
}

.edit-content {
    height: 60vh;
}
</style>
  