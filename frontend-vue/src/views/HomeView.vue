<script setup>
import { ref } from 'vue'
import VueMarkdown from 'vue-markdown-render'

const inputText = ref('')
const documents = ref([])

const Query_Document = async () => {
  try {
    const response = await fetch('http://127.0.0.1:6500/query_document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: inputText.value })
    })
    const data = await response.json()

    if (data.results && data.results.documents) {
      const combinedData = data.results.documents[0].map((content, index) => ({
        content,
        id: data.results.ids[0][index]
      }))
      documents.value = combinedData
    }

    console.log('Documents', documents.value)
  } catch (error) {
    console.error('Error fetching documents:', error)
  }
}
</script>

<template>
  <div class="container">
    <input
      type="text"
      v-model="inputText"
      class="form-control my-3"
      placeholder="Enter text"
      @input="Query_Document"
    />
    <!-- <button class="btn btn-primary" @click="Show_Document">Submit</button> -->
    <div v-for="(document, index) in documents" :key="index" class="card m-2">
      <div class="card-body">
        <h5 class="card-title content-id">
          ID: <b>{{ document.id }}</b>
        </h5>
        <div>
          <vue-markdown :source="document.content" />
        </div>
      </div>
    </div>
  </div>
</template>
