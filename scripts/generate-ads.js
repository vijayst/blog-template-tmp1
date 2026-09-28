const pat = process.env.CHATBLOGR_PAT;

async function getBlog() {
  const res = await fetch("https://chatblogr.com/api/bypass/blog", {
    headers: {
      Authorization: `Bearer ${pat}`,
    },
  });
  return res.json();
}

async function generateAdsTxt() {
  try {
    console.log('Fetching blog data for ads.txt generation...');
    const blog = await getBlog();
    
    if (!blog.adsenseId) {
      console.log('No adsenseId found, creating empty ads.txt');
      const content = '';
      require('fs').writeFileSync('public/ads.txt', content);
      console.log('✅ Empty ads.txt generated');
      return;
    }

    // Generate ads.txt with the AdSense publisher ID
    const content = `google.com, ${blog.adsenseId}, DIRECT, f08c47fec0942fa0`;
    
    // Write to public directory
    require('fs').writeFileSync('public/ads.txt', content);
    console.log('✅ ads.txt generated successfully');
    console.log('📄 Content:', content);
  } catch (error) {
    console.error('❌ Error generating ads.txt:', error);
    process.exit(1);
  }
}

generateAdsTxt();