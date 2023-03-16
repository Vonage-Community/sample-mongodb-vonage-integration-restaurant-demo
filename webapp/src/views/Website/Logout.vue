<script setup lang="ts">
import { useRouter } from 'vue-router';
import { authenticationStore } from '../../stores/authenticationStore';

const authStore = authenticationStore()
authStore.logout()

const router = useRouter();
router.push({name: 'website.order'})
</script>
