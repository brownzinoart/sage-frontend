// Netlify Function - Sage API with Premo Cannabis THC Products
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Handle both GET and POST
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    let query = '';
    let experience_level = 'casual';
    
    if (event.httpMethod === 'POST' && event.body) {
      const body = JSON.parse(event.body);
      query = body.query || '';
      experience_level = body.experience_level || 'casual';
    }
    
    // Default query if none provided
    if (!query) {
      query = 'popular products';
    }
    
    const queryLower = query.toLowerCase();
    
    // Premo Cannabis THC Products Database
    const premoProducts = [
      {
        id: 1,
        name: "Purple Punch (Indica)",
        description: "22.5% THC. Sweet grape and blueberry notes. Perfect for deep sleep and relaxation. Lab tested.",
        price: "$55/eighth",
        category: "Flower",
        thc_percentage: 22.5,
        strain_type: "indica",
        effects: ["sleep", "relaxation", "pain relief", "appetite"],
        in_stock: true
      },
      {
        id: 2,
        name: "Sour Diesel (Sativa)",
        description: "24.8% THC. Energizing diesel aroma. Great for daytime focus and creativity.",
        price: "$60/eighth",
        category: "Flower",
        thc_percentage: 24.8,
        strain_type: "sativa",
        effects: ["energy", "focus", "creativity", "uplifted"],
        in_stock: true
      },
      {
        id: 3,
        name: "Watermelon THC Gummies",
        description: "10mg THC per piece. 10 gummies per pack. Perfect for precise dosing.",
        price: "$25",
        category: "Edibles",
        thc_mg: 100,
        effects: ["relaxation", "euphoria", "happy"],
        in_stock: true
      },
      {
        id: 4,
        name: "Blue Dream Cartridge",
        description: "85.3% THC distillate. Balanced hybrid for smooth, uplifting effects.",
        price: "$45",
        category: "Vapes",
        thc_percentage: 85.3,
        strain_type: "hybrid",
        effects: ["balanced", "creative", "relaxed"],
        in_stock: true
      },
      {
        id: 5,
        name: "Wedding Cake Live Resin",
        description: "78.5% THC concentrate. Premium indica extract for maximum relief.",
        price: "$70",
        category: "Concentrates",
        thc_percentage: 78.5,
        strain_type: "indica",
        effects: ["relaxation", "euphoria", "sleep"],
        in_stock: true
      },
      {
        id: 6,
        name: "GSC Pre-Roll Pack",
        description: "21.2% THC. Pack of 5 mini pre-rolls, 0.5g each.",
        price: "$35",
        category: "Pre-rolls",
        thc_percentage: 21.2,
        strain_type: "hybrid",
        effects: ["happy", "relaxed", "creative"],
        in_stock: true
      },
      {
        id: 7,
        name: "1:1 THC:CBD Tincture",
        description: "Balanced 10mg THC / 10mg CBD per ml. Gentle relief.",
        price: "$65",
        category: "Tinctures",
        thc_mg: 300,
        cbd_mg: 300,
        effects: ["balanced", "calm", "pain relief"],
        in_stock: true
      },
      {
        id: 8,
        name: "Nighttime THC Gummies",
        description: "10mg THC + 5mg CBN per gummy. Enhanced sleep formula.",
        price: "$30",
        category: "Edibles",
        thc_mg: 100,
        cbn_mg: 50,
        effects: ["sleep", "relaxation", "sedating"],
        in_stock: true
      }
    ];
    
    // Smart product matching
    let matchedProducts = [];
    let explanation = '';
    
    // Sleep queries
    if (queryLower.includes('sleep') || queryLower.includes('insomnia') || queryLower.includes('tired')) {
      matchedProducts = premoProducts.filter(p => 
        p.effects.includes('sleep') || p.effects.includes('relaxation') || p.strain_type === 'indica'
      );
      explanation = "For better sleep, indica strains and products with CBN work best. These products can help you get the rest you need:";
    }
    // Energy queries
    else if (queryLower.includes('energy') || queryLower.includes('focus') || queryLower.includes('productive')) {
      matchedProducts = premoProducts.filter(p => 
        p.effects.includes('energy') || p.effects.includes('focus') || p.strain_type === 'sativa'
      );
      explanation = "Sativa strains provide energizing effects perfect for daytime use. Try these for enhanced focus and creativity:";
    }
    // Pain queries
    else if (queryLower.includes('pain') || queryLower.includes('hurt') || queryLower.includes('ache')) {
      matchedProducts = premoProducts.filter(p => 
        p.effects.includes('pain relief') || p.thc_percentage > 20
      );
      explanation = "Higher THC products and balanced THC:CBD ratios work well for pain management:";
    }
    // Anxiety/stress queries
    else if (queryLower.includes('anxiety') || queryLower.includes('stress') || queryLower.includes('calm')) {
      matchedProducts = premoProducts.filter(p => 
        p.effects.includes('calm') || p.effects.includes('balanced') || p.cbd_mg > 0
      );
      explanation = "For anxiety relief, balanced products or lower THC doses work best. Start low and go slow:";
    }
    // Beginner queries
    else if (queryLower.includes('beginner') || queryLower.includes('first') || queryLower.includes('new')) {
      matchedProducts = premoProducts.filter(p => 
        (p.thc_mg && p.thc_mg <= 100) || (p.thc_percentage && p.thc_percentage < 20) || p.cbd_mg > 0
      );
      explanation = "Welcome to cannabis! Start with lower THC products to find your comfort level:";
    }
    // Default - show variety
    else {
      matchedProducts = premoProducts.slice(0, 3);
      explanation = "Here are some popular products from Premo Cannabis in Keyport, NJ:";
    }
    
    // Ensure we always have some products
    if (matchedProducts.length === 0) {
      matchedProducts = premoProducts.slice(0, 3);
    }
    
    // Educational content
    const educational_resources = {
      research_sources: [
        {
          title: "Understanding Cannabis Strains",
          url: "https://www.leafly.com/news/cannabis-101",
          credibility_score: 0.85,
          summary: "Learn about the differences between indica, sativa, and hybrid strains."
        }
      ],
      key_compounds: {
        "THC": "Primary psychoactive compound",
        "CBD": "Non-psychoactive, may reduce THC anxiety",
        "CBN": "Mildly psychoactive, promotes sleep"
      }
    };
    
    const response = {
      session_id: `sage-${Date.now()}`,
      response: explanation,
      explanation: explanation,
      products: matchedProducts,
      suggestions: [
        "Tell me about your specific needs",
        "What effects are you looking for?",
        "Do you prefer flower or edibles?",
        "What's your experience level?"
      ],
      educational_resources: educational_resources,
      educational_summary: {
        key_points: [
          "Start with low doses and increase gradually",
          "Effects can take 5-10min for smoking, 30-120min for edibles",
          "Stay hydrated and have snacks ready"
        ],
        dosage_guidance: "Beginners: 2.5-5mg THC for edibles, one small puff for flower",
        safety_notes: "Must be 21+. Do not drive. Keep away from children and pets."
      },
      service_status: 200,
      status_message: "Powered by Premo Cannabis - Keyport, NJ"
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Error:', error);
    
    // Return fallback response on error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        explanation: "Welcome to Premo Cannabis! Here are some of our popular products:",
        products: [
          {
            id: 1,
            name: "Purple Punch (Indica)",
            description: "22.5% THC. Perfect for relaxation.",
            price: "$55/eighth",
            category: "Flower"
          },
          {
            id: 2,
            name: "Sour Diesel (Sativa)",
            description: "24.8% THC. Great for energy.",
            price: "$60/eighth",
            category: "Flower"
          }
        ],
        suggestions: ["Ask about our deals", "Tell me what you need help with"],
        service_status: 200
      })
    };
  }
};