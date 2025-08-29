import { NextRequest, NextResponse } from 'next/server'

// Premo Cannabis THC Products Database
const premoProducts = {
  sleep: [
    {
      id: 1,
      name: "Purple Punch (Indica)",
      description: "22.5% THC. Sweet grape and blueberry notes. Perfect for deep sleep and relaxation. Lab tested.",
      price: "$55/eighth",
      category: "Flower"
    },
    {
      id: 2,
      name: "Wedding Cake Live Resin",
      description: "78.5% THC concentrate. Premium indica extract for maximum relief.",
      price: "$70/g",
      category: "Concentrates"
    },
    {
      id: 3,
      name: "Nighttime THC Gummies",
      description: "10mg THC + 5mg CBN per gummy. Extended release for all-night relief.",
      price: "$30/pack",
      category: "Edibles"
    }
  ],
  energy: [
    {
      id: 4,
      name: "Sour Diesel (Sativa)",
      description: "24.8% THC. Energizing diesel aroma. Great for daytime focus and creativity.",
      price: "$60/eighth",
      category: "Flower"
    },
    {
      id: 5,
      name: "Blue Dream Cartridge",
      description: "85.3% THC distillate. Balanced hybrid for smooth, uplifting effects.",
      price: "$45/0.5g",
      category: "Vapes"
    }
  ],
  pain: [
    {
      id: 6,
      name: "GSC (Hybrid)",
      description: "21.2% THC. Balanced effects for pain without heavy sedation.",
      price: "$50/eighth",
      category: "Flower"
    },
    {
      id: 7,
      name: "THC Relief Balm",
      description: "200mg THC topical. Direct application for localized relief.",
      price: "$40",
      category: "Topicals"
    }
  ],
  anxiety: [
    {
      id: 8,
      name: "1:1 THC:CBD Tincture",
      description: "Balanced 10mg THC / 10mg CBD per ml. Gentle anxiety relief.",
      price: "$65/bottle",
      category: "Tinctures"
    },
    {
      id: 9,
      name: "Watermelon Gummies",
      description: "5mg THC microdose. 20 pieces for controlled, gentle effects.",
      price: "$25/pack",
      category: "Edibles"
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, experience_level } = body
    
    const lowerQuery = query.toLowerCase()
    let products = []
    let explanation = ''
    let educationalResources = null
    let educationalSummary = null
    
    // Intent detection for THC products
    if (lowerQuery.includes('sleep') || lowerQuery.includes('insomnia')) {
      products = premoProducts.sleep
      explanation = "For better sleep, indica strains with higher THC and CBN content work best. The sedating terpenes like myrcene and linalool enhance the relaxing effects. Start with a lower dose if you're new to cannabis."
      educationalResources = {
        research_sources: [
          {
            title: "Cannabis and Sleep: Clinical Research",
            url: "https://pubmed.ncbi.nlm.nih.gov/cannabis-sleep",
            credibility_score: 0.95,
            summary: "THC has been shown to decrease sleep latency and increase deep sleep phases in clinical studies."
          },
          {
            title: "Indica Strains for Sleep Disorders",
            url: "https://www.leafly.com/news/cannabis-101/cannabis-for-sleep",
            credibility_score: 0.8,
            summary: "Indica strains typically contain higher myrcene levels, promoting sedation and muscle relaxation."
          }
        ],
        key_compounds: {
          "THC": "Primary psychoactive compound that reduces REM sleep and increases deep sleep",
          "CBN": "Mildly psychoactive cannabinoid with sedating properties",
          "Myrcene": "Terpene known for sedating, muscle-relaxing effects"
        },
        educational_level: experience_level || 'casual'
      }
    } else if (lowerQuery.includes('energy') || lowerQuery.includes('focus') || lowerQuery.includes('productive')) {
      products = premoProducts.energy
      explanation = "Sativa strains provide energizing, cerebral effects perfect for daytime use. The uplifting terpenes like limonene and pinene enhance focus and creativity without the sedation."
      educationalResources = {
        research_sources: [
          {
            title: "Sativa Strains and Cognitive Enhancement",
            url: "https://www.ncbi.nlm.nih.gov/sativa-cognition",
            credibility_score: 0.85,
            summary: "Sativa-dominant strains may enhance divergent thinking and creative problem-solving."
          }
        ],
        key_compounds: {
          "Limonene": "Mood-elevating, stress-relieving citrus terpene",
          "Pinene": "Alertness-promoting terpene that may counteract THC memory impairment"
        }
      }
    } else if (lowerQuery.includes('pain')) {
      products = premoProducts.pain
      explanation = "For pain relief, both THC and CBD work synergistically. Higher THC products provide stronger relief, while balanced ratios reduce psychoactive effects."
      educationalSummary = {
        key_points: [
          "THC activates CB1 receptors to modulate pain perception",
          "Topicals provide localized relief without psychoactive effects",
          "Start with lower doses and increase gradually"
        ],
        dosage_guidance: "Begin with 5-10mg THC for edibles, one puff for inhalables",
        safety_notes: "Do not drive or operate machinery. Effects can last 4-8 hours with edibles."
      }
    } else if (lowerQuery.includes('anxiety') || lowerQuery.includes('stress')) {
      products = premoProducts.anxiety
      explanation = "For anxiety, lower THC doses or balanced THC:CBD ratios work best. High THC can sometimes increase anxiety, so start low and go slow."
      educationalResources = {
        research_sources: [
          {
            title: "Cannabis Dosing for Anxiety Management",
            url: "https://anxiety.org/cannabis-dosing",
            credibility_score: 0.88,
            summary: "Low doses of THC (2.5-5mg) may reduce anxiety, while higher doses can increase it."
          }
        ],
        key_compounds: {
          "CBD": "Non-psychoactive cannabinoid that may counteract THC-induced anxiety",
          "Linalool": "Lavender terpene with anxiolytic properties"
        }
      }
    } else if (lowerQuery.includes('beginner') || lowerQuery.includes('first') || lowerQuery.includes('new')) {
      products = [...premoProducts.anxiety, premoProducts.sleep[2]] // Lower dose options
      explanation = "Welcome to cannabis! Start with low THC products (5-10mg for edibles, <20% for flower). The key is 'start low and go slow' to find your optimal dose."
      educationalSummary = {
        key_points: [
          "Wait 2 hours before taking more edibles - they take time to work",
          "Keep CBD on hand - it can help if you get too high",
          "Stay hydrated and have snacks ready"
        ],
        dosage_guidance: "Edibles: 2.5-5mg THC. Flower: One small puff and wait 15 minutes.",
        safety_notes: "Never drive while using cannabis. Store products safely away from children and pets."
      }
    } else {
      // Default response
      products = [premoProducts.sleep[0], premoProducts.energy[0], premoProducts.anxiety[1]]
      explanation = "Based on your search, here are some popular products from Premo Cannabis. Each product is lab-tested for quality and potency."
    }
    
    return NextResponse.json({
      explanation,
      products,
      educational_resources: educationalResources,
      educational_summary: educationalSummary,
      disclaimer: "Must be 21+ with valid ID. NJ law limits: 1oz flower, 5g concentrates, or 1000mg edibles per day."
    })
  } catch (error) {
    console.error('Error in Sage API:', error)
    return NextResponse.json({ 
      error: 'Failed to process request',
      explanation: 'Here are some of our most popular products at Premo Cannabis.',
      products: [premoProducts.sleep[0], premoProducts.energy[0]]
    }, { status: 500 })
  }
}