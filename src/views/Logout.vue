<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
localStorage.removeItem('token');
router.push({name: 'home'})
</script>
