<script>
  // Shared utility functions
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
</script>
