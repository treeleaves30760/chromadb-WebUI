<template>
    <div class="container">
        <br />
        <div class="mb-3">
            <div class="input-group">
                <span class="input-group-text">請輸入ID</span>
                <input type="text" class="form-control" v-model="text_id" placeholder="Data ID">
            </div>
            <div class="input-group">
                <span class="input-group-text">請輸入知識</span>
                <textarea class="form-control" v-model="text" placeholder="Type data here..."></textarea>
                <button class="btn btn-outline-secondary" @click="saveDocument">儲存到後端資料庫</button>
            </div>
        </div>
        <div class="input-group">
            <input type="text" v-model="filter" class="form-control" placeholder="Search by keyword...">
        </div>
        <div v-for="document in filteredDocuments" :key="document.id" class="card m-2">
            <div class="card-body">
                <h5 class="card-title content-id">ID: <b>{{ document.id }}</b></h5>
                <div v-if="editId === document.id">
                    <div class="input-group mb-3">
                        <span class="input-group-text">ID</span>
                        <input type="text" class="form-control" v-model="newEditId" placeholder="New ID">
                    </div>
                    <textarea class="form-control edit-content" v-model="editText"></textarea>
                </div>
                <vue-markdown v-else :source="document.content" />
                <div class="row mt-2">
                    <div class="btn-group">
                        <button v-if="editId === document.id" class="btn btn-outline-success btn-lg" @click="updateDocument">更新</button>
                        <button v-else class="btn btn-outline-primary btn-lg" @click="() => editDocument(document)">編輯</button>
                        <button class="btn btn-outline-danger btn-lg" @click="() => deleteDocument(document)">刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import VueMarkdown from 'vue-markdown-render'

const documents = ref([]);
const text = ref('');
const text_id = ref('');
const filter = ref('');
const editText = ref('');
const editId = ref(null);
const newEditId = ref('');

const fetchDocuments = async () => {
    try {
        const response = await fetch('http://127.0.0.1:6500/get_documents');
        if (response.ok) {
            const data = await response.json();
            const data_documents = data.documents;
            const data_ids = data.ids;
            const combinedData = data_documents.map((content, index) => ({ content, id: data_ids[index] }));
            documents.value = combinedData;
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
            body: JSON.stringify({ content: text.value, id: text_id.value})
        });
        if (response.ok) {
            text.value = '';
            text_id.value = '';
            await fetchDocuments();
        } else {
            console.error('Failed to save document:', await response.json());
        }
    } catch (error) {
        console.error('Error saving document:', error);
    }
};

const updateDocument = async () => {
    if (editId.value) {
        try {
            const response = await fetch('http://127.0.0.1:6500/update_document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    old_id: editId.value,
                    new_content: editText.value,
                    new_id: newEditId.value
                })
            });
            if (response.ok) {
                editId.value = null;
                newEditId.value = '';
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

const editDocument = (document) => {
    editId.value = document.id;
    newEditId.value = document.id;
    editText.value = document.content;
};

const deleteDocument = async (data) => {
    try {
        const response = await fetch('http://127.0.0.1:6500/delete_document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: data.content, id: data.id})
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
    return documents.value.filter((document) => {
        return document.content.toLowerCase().includes(filter.value.toLowerCase())
    });
});

onMounted(fetchDocuments);
</script>

<style>
.container {
    padding: 20px;
}
.input-group-text, .form-control, .btn {
    margin-bottom: 10px;
}
.card {
    margin: 3rem 0;
}

.edit-content {
    height: 60vh;
}

.content-id {
    margin-bottom: 10px;
}
</style>