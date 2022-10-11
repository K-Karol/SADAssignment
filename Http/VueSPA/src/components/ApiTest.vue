
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "ApiTest",
    data() {
        return {
            apiRespone: "Press to get API resonse!"
        }
    },
    methods: {
        fetchApiData(){
            fetch("http://localhost:1234/api", {
                "method" : "GET"
            })
            .then(res => res.text())
            .then(text => {this.apiRespone = text})
        }
    }
});
</script>

<template>

<div class="card">
    <button type="button" @click="fetchApiData">{{ apiRespone }}</button>
  </div>

</template>

