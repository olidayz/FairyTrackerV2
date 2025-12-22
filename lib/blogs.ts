export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    author: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'magic-of-night-flight',
        title: 'The Magic of Night Flight',
        date: 'Dec 20, 2025',
        author: 'Kiki the Tooth Fairy',
        excerpt: 'Ever wonder what it looks like from high above the clouds at night? Hint: It involves a lot of stardust and shimmering city lights!',
        content: `
            <p>Welcome to my magical world! Soaring through the night sky is one of the most enchanting parts of being a Tooth Fairy. When you're tucked into bed, dreaming of adventures, I'm actually living one!</p>
            
            <h3>High Speed Stardust</h3>
            <p>To visit every child before the sun peeks over the horizon, I travel on the wings of the night wind. We use <strong>Magical Stardust</strong> which allows us to glide gracefully across the sky without making a single sound. It's like surfing on a wave of pure wonder.</p>
            
            <h3>The View from Above</h3>
            <p>The world looks so peaceful and twinkling from up here. The city lights look like scattered diamonds on a velvet blanket. Sometimes I can even see the North Star Portal glowing softly in the distance as I begin my descent toward your neighborhood.</p>
            
            <p>So next time you look at the stars, remember: one of them might be my trail of glitter as I fly by!</p>
        `,
        image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&auto=format&fit=crop',
        category: 'Fairy Tales'
    },
    {
        slug: 'how-to-prepare-your-tooth',
        title: 'A Magical Guide to Your Tooth',
        date: 'Dec 18, 2025',
        author: 'Kiki the Tooth Fairy',
        excerpt: 'Getting your tooth ready for a secret visit is part of the magic. Follow these simple steps for a truly special night!',
        content: `
            <p>A sparkling tooth is a happy tooth! Before you put your tooth under the pillow, there are a few things you can do to make my secret visit even more special.</p>
            
            <h3>The Golden Rules of Magic</h3>
            <ul>
                <li><strong>A Gentle Rinse:</strong> Give your tooth a quick splash of water. It helps it shimmer and catch the moonlight under your pillow.</li>
                <li><strong>A Secret Spot:</strong> Use a tiny pouch or a pretty tissue to keep it safe. This makes it much easier for me to find while you're dreaming!</li>
                <li><strong>Sweet Dreams:</strong> Make sure you're tucked in tight. The magic works best when you're off in a world of dreams!</li>
            </ul>
            
            <p>By following these simple steps, you make sure the magic is at its strongest when I arrive!</p>
        `,
        image: 'https://cdn-icons-png.flaticon.com/512/2865/2865586.png',
        category: 'Magic Tips'
    },
    {
        slug: 'behind-the-scenes-at-the-fairy-castle',
        title: 'Inside the Fairy Castle',
        date: 'Dec 15, 2025',
        author: 'The Castle Librarian',
        excerpt: "Take a peek at the hidden wonders of the Fairy Castle. It's where all the magic begins!",
        content: `
            <p>Behind every magical night is a team of fairies working together in the shimmering <strong>Fairy Castle</strong>. We keep track of every lost tooth and prepare special surprises for children everywhere.</p>
            
            <p>Our castle is filled with floating gardens and libraries of star-maps. We watch the weather patterns and the moon's glow to ensure every journey is safe and full of wonder. Whether it's Kiki flying over the ocean or Daisy visiting a mountain village, we're all part of the same magical story.</p>
            
            <p>We even have a giant "Wonder Map" that pulses with soft light every time a new tooth is collected. It's a busy place, but seeing that map full of light is what makes our hearts glow with happiness!</p>
        `,
        image: 'https://images.unsplash.com/photo-1534067783865-2913f5fd1503?q=80&w=800&auto=format&fit=crop',
        category: 'Behind the Scenes'
    }
];
