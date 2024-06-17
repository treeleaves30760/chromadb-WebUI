<script setup>
</script>

<template>
  <input type="text" v-model="inputText" class="form-control my-3" placeholder="Enter text" @input="Query_Document">
  <!-- <button class="btn btn-primary" @click="Show_Document">Submit</button> -->
  <div v-for="(document, index) in documents" :key="index" class="card m-2">
    <div class="card-body">
      <div>
        <vue-markdown :source="document" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import VueMarkdown from 'vue-markdown-render'

export default {
  setup() {
    const inputText = ref('');
    const documents = ref([]);

    const Query_Document = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/query_document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: inputText.value })
        });
        const data = await response.json();

        if (data.results && data.results.documents) {
          documents.value = data.results.documents[0];
        }

        console.log('Documents',documents.value);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    const Show_Document = () => {
      console.log(documents.value);
    }

    return {
      inputText,
      documents,
      Query_Document,
      Show_Document,
    };
  },
  components: {
    VueMarkdown
  },
};
</script>