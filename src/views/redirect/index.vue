<script>
  export default {
    name: 'Redirect',
    created() {
      const {query} = this.$route;
      this.$router.replace(query.path)
    },
    render(h) {
      return h()
    }
  }
</script>
