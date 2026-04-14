// Supabase Configuration
const SUPABASE_URL = 'https://fkludrjnyihdxlzhyofx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbHVkcmpueWloZHhsemh5b2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDAxNzMsImV4cCI6MjA4NTk3NjE3M30.K5pXfAfT6BZA6SQZNB6r9MCz50Tg0G8JALvsAttVMho';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Handling
async function checkAdmin() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!session) {
        if (!isLoginPage) window.location.href = 'login.html';
        return null;
    }

    const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('is_admin, email')
        .eq('id', session.user.id)
        .single();

    if (error || !profile.is_admin) {
        if (!isLoginPage) {
            alert('Access denied. Admins only.');
            await supabaseClient.auth.signOut();
            window.location.href = 'login.html';
        }
        return null;
    }

    return profile;
}

// Analytics Helpers
async function getAppUsageAnalytics() {
    const { data, error } = await supabaseClient
        .from('user_usage_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Error fetching analytics:', error);
        return [];
    }
    return data;
}

// Community Post Helpers
async function createCommunityPost(postData, images = []) {
    try {
        const imageUrls = [];
        for (const image of images) {
            const fileName = `${Date.now()}_${image.name}`;
            const { data, error } = await supabaseClient.storage
                .from('community-posts')
                .upload(fileName, image);
            
            if (error) throw error;
            
            const { data: { publicUrl } } = supabaseClient.storage
                .from('community-posts')
                .getPublicUrl(fileName);
                
            imageUrls.push(publicUrl);
        }

        const { data, error } = await supabaseClient
            .from('community_posts')
            .insert([{
                ...postData,
                image_urls: imageUrls,
                author_id: (await supabaseClient.auth.getUser()).data.user.id
            }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error creating community post:', error);
        throw error;
    }
}

async function getDrafts() {
    const { data, error } = await supabaseClient
        .from('community_posts')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching drafts:', error);
        return [];
    }
    return data;
}

async function publishPost(postId) {
    const { data, error } = await supabaseClient
        .from('community_posts')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .eq('id', postId);

    if (error) throw error;
    return data;
}

async function getAllPosts() {
    const { data, error } = await supabaseClient
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return data;
}

async function updateCommunityPost(postId, postData, newImages = [], keepExistingUrls = []) {
    try {
        const finalImageUrls = [...keepExistingUrls];
        
        for (const image of newImages) {
            const fileName = `community_posts/${Date.now()}_${image.name}`;
            const { data, error } = await supabaseClient.storage
                .from('community-posts')
                .upload(fileName, image);
            
            if (error) throw error;
            
            const { data: { publicUrl } } = supabaseClient.storage
                .from('community-posts')
                .getPublicUrl(fileName);
                
            finalImageUrls.push(publicUrl);
        }

        const { data, error } = await supabaseClient
            .from('community_posts')
            .update({
                ...postData,
                image_urls: finalImageUrls,
                cover_image_url: finalImageUrls.length > 0 ? finalImageUrls[0] : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', postId)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating community post:', error);
        throw error;
    }
}

// Global functions for HTML access
window.checkAdmin = checkAdmin;
window.getAppUsageAnalytics = getAppUsageAnalytics;
window.createCommunityPost = createCommunityPost;
window.updateCommunityPost = updateCommunityPost;
window.getDrafts = getDrafts;
window.getAllPosts = getAllPosts;
window.publishPost = publishPost;
window.supabaseClient = supabaseClient;
