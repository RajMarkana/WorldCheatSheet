import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";


const model = new ChatGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  temperature: 0,
});


const cityInfoSchema = {
  attractions: [
    {
      name: "string",
      description: "string",
      price: "string",
    },
  ],
  restaurants: [
    {
      name: "string",
      cuisine: "string",
      priceRange: "string",
    },
  ],
  accommodations: [
    {
      name: "string",
      type: "string",
      priceRange: "string",
    },
  ],
  culture: {
    highlights: ["string"],
    information: "string",
  },
  events: [
    {
      name: "string",
      date: "string",
      description: "string",
    },
  ],
  tips: ["string"],
};


const parser = StructuredOutputParser.fromNamesAndDescriptions({
  attractions: "Array of attractions with name, description, and price",
  restaurants: "Array of restaurants with name, cuisine, and price range",
  accommodations: "Array of accommodations with name, type, and price range", 
  culture: "Object with highlights array and information string",
  events: "Array of events with name, date, and description",
  tips: "Array of strings with tips for visitors",
});


const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", `You are a city information assistant. You MUST ONLY output a valid JSON object.`],
  [
    "human",
    `Return a JSON object with information about {city}, {country}. 
     
     {format_instructions}
     
     Include at least 3 items in each array. All prices in USD format.`,
  ],
]);

export const getCityInfo = async (city, country) => {
  try {
    
    const formatInstructions = await parser.getFormatInstructions();

    
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      async (response) => {
        try {
          
          const content = response.content || response;
          
          
          let result;
          
          try {
            
            result = await parser.parse(content);
          } catch (parseError) {
            console.log("Direct parsing failed, trying regex extraction");
            
            
            const jsonRegex = /\{[\s\S]*\}/g;
            const match = content.match(jsonRegex);
            
            if (match) {
              try {
                
                const extractedJson = match[0].replace(/```json\n?|```/g, "").trim();
                result = JSON.parse(extractedJson);
              } catch (extractError) {
                console.error("JSON extraction failed:", extractError);
                throw new Error("Failed to extract valid JSON from response");
              }
            } else {
              console.error("No JSON structure found in response");
              throw new Error("No JSON structure found in response");
            }
          }
          
          return result;
        } catch (error) {
          console.error("Parser error:", error);
          throw error;
        }
      },
    ]);

    
    const result = await chain.invoke({
      city,
      country,
      format_instructions: formatInstructions,
    });

    

    return {
      ...result,
      metadata: {
        timestamp: new Date().toISOString(),
        source: "LangChain with Groq",
        city,
        country,
      },
    };
  } catch (error) {
    console.error("Error fetching city information:", error);
    console.log("Full error details:", error);
    throw new Error(`Failed to fetch information for ${city}, ${country}: ${error.message}`);
  }
};


const languageSchema = {
  basicPhrases: [
    {
      phrase: "string",
      pronunciation: "string",
      meaning: "string"
    }
  ],
  emergencyPhrases: [
    {
      phrase: "string",
      pronunciation: "string",
      meaning: "string"
    }
  ],
  numbers: [
    {
      number: "string",
      pronunciation: "string",
      meaning: "string"
    }
  ]
};

const transportationSchema = {
  publicTransport: [
    {
      type: "string",
      routes: ["string"],
      fares: "string",
      operatingHours: "string"
    }
  ],
  taxiServices: [
    {
      name: "string",
      contactInfo: "string",
      averageFares: "string"
    }
  ],
  tips: ["string"]
};

const safetySchema = {
  emergencyContacts: [
    {
      service: "string",
      number: "string",
      description: "string"
    }
  ],
  safetyTips: ["string"],
  hospitals: [
    {
      name: "string",
      address: "string",
      contact: "string"
    }
  ]
};

const shoppingSchema = {
  markets: [
    {
      name: "string",
      type: "string",
      specialties: ["string"],
      location: "string"
    }
  ],
  bargainingTips: ["string"],
  localProducts: [
    {
      name: "string",
      description: "string",
      priceRange: "string"
    }
  ]
};

const budgetSchema = {
  dailyCosts: {
    budget: "string",
    midRange: "string",
    luxury: "string"
  },
  mealCosts: {
    budget: "string",
    midRange: "string",
    luxury: "string"
  },
  transportationCosts: {
    public: "string",
    taxi: "string",
    rental: "string"
  },
  tippingGuidelines: ["string"]
};

const localAppsSchema = {
  transportation: [
    {
      name: "string",
      description: "string",
      platform: "string",
      downloadLink: "string"
    }
  ],
  foodDelivery: [
    {
      name: "string",
      description: "string",
      platform: "string",
      downloadLink: "string"
    }
  ],
  payments: [
    {
      name: "string",
      description: "string",
      platform: "string",
      downloadLink: "string"
    }
  ]
};



const executeChain = async (promptTemplate, parser, city, country) => {
  try {
    const formatInstructions = await parser.getFormatInstructions();
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      async (response) => {
        const content = response.content || response;
        try {
          return await parser.parse(content);
        } catch (error) {
          const jsonRegex = /\{[\s\S]*\}/g;
          const match = content.match(jsonRegex);
          if (match) {
            const extractedJson = match[0].replace(/```json\n?|```/g, "").trim();
            return JSON.parse(extractedJson);
          }
          throw new Error("Failed to extract valid JSON from response");
        }
      }
    ]);

    const result = await chain.invoke({
      city,
      country,
      format_instructions: formatInstructions
    });

    return {
      ...result,
      metadata: {
        timestamp: new Date().toISOString(),
        source: "LangChain with Groq",
        city,
        country
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch information for ${city}, ${country}: ${error.message}`);
  }
};

export const getLanguageInfo = async (city, country) => {
  
  
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    basicPhrases: "Array of basic phrases with pronunciation and meaning",
    emergencyPhrases: "Array of emergency phrases with pronunciation and meaning",
    numbers: "Array of numbers with pronunciation and meaning"
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are a language assistant. You MUST ONLY output a valid JSON object.`],
    [
      "human",
      `Return a JSON object with common phrases and expressions used in {city}, {country}.
       {format_instructions}
       Include at least 5 items in each array.
       Make sure each phrase object has 'phrase', 'pronunciation', and 'meaning' fields.
       Make sure each number object has 'number', 'pronunciation', and 'meaning' fields.`
    ]
  ]);

  try {
    const result = await executeChain(promptTemplate, parser, city, country);
    console.log('Language info result:', result);
    
    
    if (!result.basicPhrases || !result.emergencyPhrases || !result.numbers) {
      throw new Error('Invalid response structure from AI service');
    }
    
    return result;
  } catch (error) {
    console.error('Error in getLanguageInfo:', error);
    throw new Error(`Failed to get language information: ${error.message}`);
  }
};


const cleanJsonString = (str) => {
  return str
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') 
    .replace(/\n/g, ' ') 
    .replace(/\r/g, ' ') 
    .replace(/\t/g, ' ') 
    .replace(/\s+/g, ' ') 
    .trim();
};

export const getTransportInfo = async (city, country) => {
  console.log('getTransportInfo called with:', { city, country });
  
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    publicTransport: "Array of public transportation options with type, routes (string or array), fares, and operating hours",
    taxiServices: "Array of taxi services with name, contact info, and average fares",
    tips: "Array of practical transport tips for visitors"
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are a travel expert providing detailed transport information. You MUST ONLY output a valid JSON object.`],
    [
      "human",
      `Return a JSON object with transport information for {city}, {country}.
       {format_instructions}
       
       For public transport routes, you can provide either:
       1. A string describing the routes (e.g., "Multiple routes covering the city")
       2. An array of specific routes (e.g., ["Route 1", "Route 2"])
       
       Include at least 2-3 public transport options, 2-3 taxi services, and 3-5 practical tips.
       Make sure all information is accurate and helpful for visitors.
       Do not include any special characters or line breaks in the response.`
    ]
  ]);

  try {
    const formatInstructions = await parser.getFormatInstructions();
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      async (response) => {
        const content = response.content || response;
        try {
          return await parser.parse(content);
        } catch (error) {
          console.log('Parser error, attempting JSON extraction:', error);
          const jsonRegex = /\{[\s\S]*\}/g;
          const match = content.match(jsonRegex);
          if (match) {
            try {
              
              const cleanedJson = cleanJsonString(match[0].replace(/```json\n?|```/g, "").trim());
              
              return JSON.parse(cleanedJson);
            } catch (parseError) {
              console.error('JSON parse error:', parseError);
              throw new Error(`Failed to parse JSON: ${parseError.message}`);
            }
          }
          throw new Error("Failed to extract valid JSON from response");
        }
      }
    ]);

    const result = await chain.invoke({
      city,
      country,
      format_instructions: formatInstructions
    });

    

    
    if (!result.publicTransport || !result.taxiServices || !result.tips) {
      throw new Error('Invalid transport info structure: missing required fields');
    }

    
    if (!Array.isArray(result.publicTransport)) {
      result.publicTransport = [];
    }
    if (!Array.isArray(result.taxiServices)) {
      result.taxiServices = [];
    }
    if (!Array.isArray(result.tips)) {
      result.tips = [];
    }

    
    result.publicTransport.forEach((transport, index) => {
      if (!transport.type || !transport.routes || !transport.fares || !transport.operatingHours) {
        throw new Error(`Invalid public transport item at index ${index}: missing required fields`);
      }
    });

    return result;
  } catch (error) {
    console.error('Error in getTransportInfo:', error);
    throw new Error(`Failed to get transport information: ${error.message}`);
  }
};

export const getSafetyInfo = async (city, country) => {
  
  
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    emergencyContacts: "Array of emergency services with contact numbers and descriptions",
    safetyTips: "Array of safety tips and precautions",
    hospitals: "Array of major hospitals with contact information",
    safeAreas: "Array of safe areas and neighborhoods",
    warnings: "Array of current safety warnings or concerns"
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are a safety information assistant. You MUST ONLY output a valid JSON object.`],
    [
      "human",
      `Return a JSON object with safety information for {city}, {country}.
       {format_instructions}
       Include at least 3 items in each array.
       Make sure each emergency contact has 'service', 'number', and 'description' fields.
       Make sure each hospital has 'name', 'address', and 'contact' fields.
       Include practical and up-to-date safety information.`
    ]
  ]);

  try {
    const result = await executeChain(promptTemplate, parser, city, country);
    
    
    
    if (!result.emergencyContacts || !result.safetyTips || !result.hospitals) {
      throw new Error('Invalid response structure from AI service');
    }
    
    return result;
  } catch (error) {
    console.error('Error in getSafetyInfo:', error);
    throw new Error(`Failed to get safety information: ${error.message}`);
  }
};

export const getShoppingInfo = async (city, country) => {
  
  
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    markets: "Array of shopping areas with name, type, specialties array, and location",
    localProducts: "Array of local products with name, description, and price range",
    bargainingTips: "Array of tips for bargaining and shopping",
    shoppingHours: "Object with typical shopping hours and special times",
    paymentInfo: "Array of accepted payment methods and tips"
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are a shopping guide assistant. You MUST ONLY output a valid JSON object without any markdown formatting or code blocks.`],
    [
      "human",
      `Return a JSON object with shopping information for {city}, {country}.
       {format_instructions}
       
       Important:
       1. All prices should be in USD
       2. Return actual objects and arrays, not string representations
       3. Include at least 2-3 items in each array
       4. Make sure markets have name, type, specialties (array), and location
       5. Make sure localProducts have name, description, and priceRange
       6. Make sure shoppingHours has typical and special (optional) fields
       7. Do not include any markdown formatting or code blocks in the response
       8. Do not include any special characters or line breaks in the response`
    ]
  ]);

  try {
    const formatInstructions = await parser.getFormatInstructions();
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      async (response) => {
        const content = response.content || response;
        try {
          
          return await parser.parse(content);
        } catch (error) {
          console.log('Parser error, attempting JSON extraction:', error);
          
          
          let jsonStr = content.replace(/```json\n?|```/g, '').trim();
          
          const firstCurly = jsonStr.indexOf('{');
          let open = 0, close = 0, end = -1;
          for (let i = firstCurly; i < jsonStr.length; i++) {
            if (jsonStr[i] === '{') open++;
            if (jsonStr[i] === '}') close++;
            if (open > 0 && open === close) { end = i + 1; break; }
          }
          if (firstCurly !== -1 && end !== -1) {
            jsonStr = jsonStr.slice(firstCurly, end);
          }
          
          jsonStr = cleanJsonString(jsonStr);
          
          try {
            return JSON.parse(jsonStr);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error(`Failed to parse JSON: ${parseError.message}`);
          }
        }
      }
    ]);

    const result = await chain.invoke({
      city,
      country,
      format_instructions: formatInstructions
    });

    

    
    if (!result.markets || !result.localProducts || !result.bargainingTips || 
        !result.shoppingHours || !result.paymentInfo) {
      throw new Error('Invalid shopping info structure: missing required fields');
    }

    
    if (!Array.isArray(result.markets)) {
      throw new Error('Invalid markets data: must be an array');
    }
    if (!Array.isArray(result.localProducts)) {
      throw new Error('Invalid local products data: must be an array');
    }
    if (!Array.isArray(result.bargainingTips)) {
      throw new Error('Invalid bargaining tips data: must be an array');
    }
    if (!Array.isArray(result.paymentInfo)) {
      throw new Error('Invalid payment info data: must be an array');
    }

    
    result.markets.forEach((market, index) => {
      if (!market.name || !market.type || !market.location) {
        throw new Error(`Invalid market item at index ${index}: missing required fields`);
      }
      if (!Array.isArray(market.specialties)) {
        throw new Error(`Invalid market specialties at index ${index}: must be an array`);
      }
    });

    return result;
  } catch (error) {
    console.error('Error in getShoppingInfo:', error);
    throw new Error(`Failed to get shopping information: ${error.message}`);
  }
};

export const getBudgetInfo = async (city, country) => {
  
  
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    dailyCosts: "Object with total daily cost estimate",
    accommodation: "Object with accommodation price ranges",
    transportation: "Object with transportation cost estimates",
    food: "Object with food cost estimates",
    activities: "Object with activity cost estimates",
    tippingGuidelines: "Array of tipping customs and recommendations"
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are a budget planning assistant. You MUST ONLY output a valid JSON object.`],
    [
      "human",
      `Return a JSON object with detailed cost information for {city}, {country}.
       {format_instructions}
       
       Important:
       1. All costs should be in USD
       2. Return actual objects and arrays, not string representations
       3. Include at least 2-3 items in each category
       4. Make sure tippingGuidelines is an array of strings
       5. All prices should be in the format "min-max" (e.g., "10-20")
       6. Do not include any special characters or line breaks in the response`
    ]
  ]);

  try {
    const formatInstructions = await parser.getFormatInstructions();
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      async (response) => {
        const content = response.content || response;
        try {
          return await parser.parse(content);
        } catch (error) {
          console.log('Parser error, attempting JSON extraction:', error);
          const jsonRegex = /\{[\s\S]*\}/g;
          const match = content.match(jsonRegex);
          if (match) {
            try {
              
              const cleanedJson = cleanJsonString(match[0].replace(/```json\n?|```/g, "").trim());
              
              return JSON.parse(cleanedJson);
            } catch (parseError) {
              console.error('JSON parse error:', parseError);
              throw new Error(`Failed to parse JSON: ${parseError.message}`);
            }
          }
          throw new Error("Failed to extract valid JSON from response");
        }
      }
    ]);

    const result = await chain.invoke({
      city,
      country,
      format_instructions: formatInstructions
    });

    

    
    if (!result.dailyCosts || !result.accommodation || !result.transportation || 
        !result.food || !result.activities || !result.tippingGuidelines) {
      throw new Error('Invalid budget info structure: missing required fields');
    }

    
    if (!Array.isArray(result.tippingGuidelines)) {
      throw new Error('Invalid tipping guidelines: must be an array');
    }

    return result;
  } catch (error) {
    console.error('Error in getBudgetInfo:', error);
    throw new Error(`Failed to get budget information: ${error.message}`);
  }
};

export const getLocalAppsInfo = async (city, country) => {
  
  
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    transportApps: "Array of transportation app IDs (e.g., 'details?id=com.app.name')",
    foodDeliveryApps: "Array of food delivery app IDs (e.g., 'details?id=com.app.name')",
    paymentApps: "Array of payment app IDs (e.g., 'details?id=com.app.name')"
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are a local apps guide. You MUST ONLY output a valid JSON object without any markdown formatting or code blocks.`],
    [
      "human",
      `Return a JSON object with local apps information for {city}, {country}.
       {format_instructions}
       
       Important:
       1. Return app IDs in the format 'details?id=com.app.name'
       2. Include at least 2 items in each array
       3. Make sure all app IDs are valid Play Store format
       4. Do not include any markdown formatting or code blocks
       5. Do not include any special characters or line breaks in the response`
    ]
  ]);

  try {
    const formatInstructions = await parser.getFormatInstructions();
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      async (response) => {
        const content = response.content || response;
        try {
          
          return await parser.parse(content);
        } catch (error) {
          console.log('Parser error, attempting JSON extraction:', error);
          
          
          let jsonStr = content.replace(/```json\n?|```/g, '').trim();
          
          
          jsonStr = cleanJsonString(jsonStr);
          console.log('Cleaned JSON string:', jsonStr);
          
          try {
            return JSON.parse(jsonStr);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error(`Failed to parse JSON: ${parseError.message}`);
          }
        }
      }
    ]);

    const result = await chain.invoke({
      city,
      country,
      format_instructions: formatInstructions
    });

    

    
    if (!result.transportApps || !result.foodDeliveryApps || !result.paymentApps) {
      throw new Error('Invalid local apps info structure: missing required fields');
    }

    
    if (!Array.isArray(result.transportApps)) {
      throw new Error('Invalid transport apps data: must be an array');
    }
    if (!Array.isArray(result.foodDeliveryApps)) {
      throw new Error('Invalid food delivery apps data: must be an array');
    }
    if (!Array.isArray(result.paymentApps)) {
      throw new Error('Invalid payment apps data: must be an array');
    }

    
    const validateAppId = (appId) => {
      return typeof appId === 'string' && appId.startsWith('details?id=');
    };

    result.transportApps.forEach((appId, index) => {
      if (!validateAppId(appId)) {
        throw new Error(`Invalid transport app ID at index ${index}: must start with 'details?id='`);
      }
    });

    result.foodDeliveryApps.forEach((appId, index) => {
      if (!validateAppId(appId)) {
        throw new Error(`Invalid food delivery app ID at index ${index}: must start with 'details?id='`);
      }
    });

    result.paymentApps.forEach((appId, index) => {
      if (!validateAppId(appId)) {
        throw new Error(`Invalid payment app ID at index ${index}: must start with 'details?id='`);
      }
    });

    return result;
  } catch (error) {
    console.error('Error in getLocalAppsInfo:', error);
    throw new Error(`Failed to get local apps information: ${error.message}`);
  }
};