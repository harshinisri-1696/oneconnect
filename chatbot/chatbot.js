/**
 * OneConnect AI — Reusable Global Multilingual Chatbot Component
 *
 * Implements a global conversational assistant available across the entire website.
 * Supports English, Tamil, Hindi, Telugu, Kannada, and Malayalam.
 * Exposes a Context API for citizen profiles, scheme contexts, page/module context, and eligibility.
 *
 * Namespace: govcenter-chatbot* (JS + CSS classes)
 * Global Variable: window.oneConnectChatbot
 * Public Initializer: window.initGovCenterChatbot(options)
 */

(function (window) {
  'use strict';

  // ============================================================
  //  MULTILINGUAL TRANSLATION DICTIONARY
  // ============================================================
  const TRANSLATIONS = {
    en: {
      langName: "English",
      title: "OneConnect AI",
      subtitle: "Your Government Services Assistant",
      placeholder: "Ask about government schemes...",
      statusOnline: "Online",
      closeBtn: "Close OneConnect AI Assistant",
      sendBtn: "Send message",
      welcome: "Hi! I'm OneConnect AI Assistant 👋\nI can help you find schemes you're eligible for, search categories, or help with applications.\n\nTry one of the suggestions below, or type your question.",
      welcomeProfile: "Hi! I'm OneConnect AI Assistant 👋\nI can see your profile ({profile}). I can help you find schemes you're eligible for, search categories, or help with applications.\n\nTry one of the suggestions below, or type your question.",
      greetingResponse: "Hello! 👋 I'm OneConnect AI, your Government Services Assistant.\n\nI can help you find government schemes, check eligibility, understand benefits, find required documents, explain application procedures, and explore government jobs.\n\nHow can I help you today?",
      thanksResponse: "You're welcome! 😊 I'm happy to help. You can ask me about schemes, eligibility, documents, applications, or government jobs anytime.",
      goodbyeResponse: "You're welcome! 👋 Feel free to come back whenever you need help.",
      casualResponse: "I'm OneConnect AI 🤖. I can help you discover government schemes, check your eligibility, explain benefits and documents, guide you through application steps, and help you explore government jobs.",
      fallbackResponse: "I'm here to help with government schemes, eligibility, benefits, documents, application procedures, and government jobs.\n\nTry asking:\n• What schemes am I eligible for?\n• Show scholarship schemes\n• What documents do I need?\n• How do I apply?\n• Find government jobs for me",
      noEligible: "I checked your profile ({profile}) against the database but couldn't identify directly eligible schemes. Try adding complete profile details for more accurate matches.",
      foundEligible: "Based on your profile ({profile}), I found **{count} eligible scheme(s)**.{filtered}",
      filteredText: " The list on the main page is now filtered to show them.",
      jobsResponse: "You can explore available **Government Jobs** on the main navigation panel. The Jobs module contains vacancies, eligibility criteria, salary descriptions, and direct links to apply.\n\nWould you like me to help search for schemes instead?",
      profileHeader: "**Here is your active profile context:**",
      profileAge: "Age",
      profileState: "State",
      profileGender: "Gender",
      profileOccupation: "Occupation",
      profileIncome: "Income",
      profilePwD: "PwD",
      profileYes: "Yes",
      profileNo: "No",
      profileFooter: "You can update these details anytime using the 'Edit Profile' button at the top.",
      noActiveSchemeDoc: "Please select or ask about a specific scheme first to get its required documents. You can click 'View Details' on any card.",
      noActiveSchemeApply: "To apply for schemes:\n1. Open the scheme card on the listing page.\n2. Click **View Details** to read its Application steps.\n3. Pull together the required documents and submit via the official portal.\n\nSelect a specific scheme first to get custom application steps.",
      schemeLevelCentral: "Central Govt",
      schemeLevelState: "Scheme",
      eligibleTag: "Eligible",
      viewDetails: "View Details →",
      viewFullDetails: "View Full Details →",
      btnEligible: "Am I eligible?",
      btnDocuments: "Required documents",
      btnApply: "How do I apply?",
      btnShowEligibleGlobal: "Show only eligible schemes",
      filterAppliedGlobal: "Filter applied — see page",
      noDocInfo: "Required documents for **{name}** are not specified in the dataset. Please consult the official service portal.",
      noApplyInfo: "Application process details for **{name}** are not specified in the dataset. Please click \"View Full Details →\" or check the department portal.",
      datasetDisclaimer: "(Note: Scheme details are presented in their original language from the database)",
      aboutScheme: "About",
      benefitsFor: "Benefits for",
      eligibilityFor: "Eligibility for",
      documentsFor: "Required documents for",
      applyFor: "How to apply for",
      noBenefitInfo: "Benefit details for **{name}** are not specified in the dataset.",
      noEligibilityInfo: "Eligibility criteria for **{name}** are not specified in the dataset.",
      noDescInfo: "Description details for **{name}** are not specified in the dataset.",
      evalEligible: "Eligible",
      evalNotEligible: "Not Eligible",
      evalInfoNeeded: "Information required",
      evalEligibleReason: "🟢 **Eligible** — Based on {profile}, you qualify for **{name}**.\n\n_Reason: {reason}_",
      evalNotEligibleReason: "🔴 **Not Eligible** — Based on {profile}, you do not qualify for **{name}**.\n\n_Reason: {reason}_",
      evalInfoNeededReason: "🟠 **Information required** — Your profile details may be incomplete to run an eligibility check for **{name}**.\n\n_Reason: {reason}_",
      searchTitle: "I found **{count} scheme(s)** matching \"{query}\":",
      chipEligible: "Eligible schemes for me",
      queryEligible: "Which schemes am I eligible for?",
      chipScholarship: "Show scholarships",
      queryScholarship: "Show scholarships for students",
      chipWomen: "Schemes for women",
      queryWomen: "Find schemes for women",
      chipFinancial: "Financial assistance",
      queryFinancial: "Which schemes provide financial assistance?",
      chipFarmer: "Farmer schemes",
      queryFarmer: "Show schemes for farmers",
      greetings: ['hi', 'hello', 'hey', 'hii', 'hiii', 'good morning', 'good afternoon', 'good evening', 'hello there', 'hey there'],
      thanks: ['thanks', 'thank you', 'thankyou', 'thanks a lot', 'thank you so much'],
      goodbye: ['bye', 'goodbye', 'see you', "that's all", 'okay bye'],
      casuals: ['how are you', 'what can you do', 'who are you', 'what do you do'],
      eligibility: ['eligible', 'qualify', 'which schemes', 'my schemes', 'any schemes', 'what schemes can i apply for', 'show schemes i qualify for', 'find schemes for me'],
      benefits: ['benefit', 'what do i get', 'perks', 'what does it give', 'details'],
      eligibilityCriteria: ['who can apply', 'who qualifies', 'eligibility criteria', 'who is eligible'],
      about: ['what is this scheme', 'explain this scheme', 'describe this scheme', 'tell me about this'],
      documents: ['document', 'what should i prepare', 'needed', 'documents'],
      apply: ['how to apply', 'how can i apply', 'where can i apply', 'application process', 'how to register', 'how do i apply', 'how do i get this benefit'],
      jobs: ['job', 'vacancy', 'vacancies', 'career', 'employment', 'work'],
      profile: ['profile', 'information do you know about me', 'my age', 'my state', 'my occupation', 'my income', 'show my profile'],
      search: [
        'scholarship', 'student', 'education', 'study', 'school', 'college',
        'women', 'woman', 'female', 'girl', 'mahila',
        'farmer', 'agriculture', 'rural', 'crop', 'kisan', 'fishing', 'fisherman',
        'financial', 'money', 'cash', 'assistance', 'relief', 'stipend', 'pension',
        'disab', 'pwd', 'handicap', 'divyang',
        'senior', 'old age', 'elderly', 'retired',
        'business', 'msme', 'startup', 'entrepreneur', 'small industry',
        'housing', 'home loan', 'shelter', 'awas', 'pmay',
        'tell me about', 'details of', 'more about', 'what is', 'describe', 'explain', 'info on', 'information on', 'show me'
      ]
    },
    ta: {
      langName: "தமிழ்",
      title: "OneConnect AI",
      subtitle: "உங்கள் அரசு சேவைகள் உதவியாளர்",
      placeholder: "அரசு திட்டங்களைப் பற்றி கேளுங்கள்...",
      statusOnline: "ஆன்லைன்",
      closeBtn: "OneConnect AI உதவியாளரை மூடு",
      sendBtn: "செய்தியை அனுப்பு",
      welcome: "வணக்கம்! நான் OneConnect AI உதவியாளர் 👋\nஉங்களுக்கு தகுதியான திட்டங்களைக் கண்டறிய, பிரிவுகளைத் தேட அல்லது விண்ணப்பங்களுக்கு உதவ என்னால் முடியும்.\n\nகீழே உள்ள பரிந்துரைகளில் ஒன்றை முயற்சிக்கவும் அல்லது உங்கள் கேள்வியைத் தட்டச்சு செய்யவும்.",
      welcomeProfile: "வணக்கம்! நான் OneConnect AI உதவியாளர் 👋\nஉங்கள் சுயவிவரத்தை என்னால் பார்க்க முடிகிறது ({profile}). உங்களுக்கு தகுதியான திட்டங்களைக் கண்டறிய, பிரிவுகளைத் தேட அல்லது விண்ணப்பங்களுக்கு உதவ என்னால் முடியும்.\n\nகீழே உள்ள பரிந்துரைகளில் ஒன்றை முயற்சிக்கவும் அல்லது உங்கள் கேள்வியைத் தட்டச்சு செய்யவும்.",
      greetingResponse: "வணக்கம்! 👋 நான் OneConnect AI, உங்கள் அரசு சேவைகள் உதவியாளர்.\n\nஅரசு திட்டங்கள், தகுதி, தேவையான ஆவணங்கள், விண்ணப்பிக்கும் முறைகள் மற்றும் அரசு வேலைகள் குறித்து நான் உங்களுக்கு உதவ முடியும்.\n\nநான் உங்களுக்கு எப்படி உதவலாம்?",
      thanksResponse: "உங்களுக்கு வரவேற்கிறோம்! 😊 உதவ முடிந்ததில் மகிழ்ச்சி. திட்டங்கள், தகுதி, ஆவணங்கள், விண்ணப்பங்கள் அல்லது அரசு வேலைகள் பற்றி எப்போது வேண்டுமானாலும் என்னிடம் கேட்கலாம்.",
      goodbyeResponse: "வரவேற்கிறோம்! 👋 உங்களுக்குத் தேவைப்படும்போது எப்போது வேண்டுமானாலும் திரும்ப வாருங்கள்.",
      casualResponse: "நான் OneConnect AI 🤖. அரசு திட்டங்களைக் கண்டறியவும், தகுதியைச் சரிபார்க்கவும், நன்மைகள் மற்றும் ஆவணங்களை விளக்கவும், விண்ணப்பப் படிகளில் வழிகாட்டவும், அரசு வேலைகளை ஆராயவும் நான் உங்களுக்கு உதவ முடியும்.",
      fallbackResponse: "அரசு திட்டங்கள், தகுதி, நன்மைகள், ஆவணங்கள், விண்ணப்ப நடைமுறைகள் மற்றும் அரசு வேலைகள் குறித்து உதவ நான் இங்கே இருக்கிறேன்.\n\nஇவற்றைக் கேட்டுப் பாருங்கள்:\n• எனக்கு என்ன திட்டங்கள் கிடைக்கும்?\n• மாணவர்களுக்கான திட்டங்களைக் காட்டு\n• எனக்கு என்ன ஆவணங்கள் தேவை?\n• நான் எப்படி விண்ணப்பிப்பது?\n• எனக்கு அரசு வேலைகளைத் தேடு",
      noEligible: "உங்கள் சுயவிவரத்தை ({profile}) தரவுத்தளத்துடன் சரிபார்த்தேன், ஆனால் தகுதியான திட்டங்களை நேரடியாகக் கண்டறிய முடியவில்லை. துல்லியமான முடிவுகளுக்கு முழுமையான சுயவிவர விவரங்களைச் சேர்க்கவும்.",
      foundEligible: "உங்கள் சுயவிவரத்தின்படி ({profile}), நான் **{count} தகுதியான திட்டங்களைக்** கண்டறிந்துள்ளேன்.{filtered}",
      filteredText: " முதன்மைப் பக்கத்தில் உள்ள பட்டியல் இப்போது அவற்றை மட்டும் காட்ட வடிகட்டப்பட்டுள்ளது.",
      jobsResponse: "முதன்மை வழிசெலுத்தல் பலகத்தில் உள்ள **அரசு வேலைகள்** பகுதியை நீங்கள் ஆராயலாம். வேலைவாய்ப்பு பிரிவில் காலியிடங்கள், தகுதி வரம்புகள், சம்பள விவரங்கள் மற்றும் விண்ணப்பிப்பதற்கான நேரடி இணைப்புகள் உள்ளன.\n\nஅதற்கு பதிலாக திட்டங்களைத் தேட நான் உதவ வேண்டுமா?",
      profileHeader: "**உங்கள் செயலில் உள்ள சுயவிவர சூழல் இதோ:**",
      profileAge: "வயது",
      profileState: "மாநிலம்",
      profileGender: "பாலினம்",
      profileOccupation: "தொழில்",
      profileIncome: "வருமானம்",
      profilePwD: "மாற்றுத்திறனாளி (PwD)",
      profileYes: "ஆம்",
      profileNo: "இல்லை",
      profileFooter: "மேலே உள்ள 'சுயவிவரத்தைத் திருத்து' பொத்தானைப் பயன்படுத்தி இந்த விவரங்களை எப்போது வேண்டுமானாலும் புதுப்பிக்கலாம்.",
      noActiveSchemeDoc: "தேவையான ஆவணங்களைப் பெற முதலில் ஒரு குறிப்பிட்ட திட்டத்தைத் தேர்ந்தெடுக்கவும் அல்லது அதைப் பற்றிக் கேட்கவும். நீங்கள் எந்த கார்டிலும் 'விவரங்களைக் காண்க' என்பதைக் கிளிக் செய்யலாம்.",
      noActiveSchemeApply: "திட்டங்களுக்கு விண்ணப்பிக்க:\n1. திட்ட கார்டில் விவரங்களைக் காண்க என்பதை அழுத்தவும்.\n2. விண்ணப்பப் படிகளைப் படிக்கவும்.\n3. தேவையான ஆவணங்களைச் சேகரித்து விண்ணப்பிக்கவும்.\n\nகுறிப்பிட்ட விண்ணப்பப் படிகளைப் பெற முதலில் ஒரு திட்டத்தைத் தேர்ந்தெடுக்கவும்.",
      schemeLevelCentral: "மத்திய அரசு",
      schemeLevelState: "திட்டம்",
      eligibleTag: "தகுதியுடையது",
      viewDetails: "விவரங்கள் காண்க →",
      viewFullDetails: "முழு விவரங்களையும் காண்க →",
      btnEligible: "எனக்கு தகுதி உள்ளதா?",
      btnDocuments: "தேவையான ஆவணங்கள்",
      btnApply: "விண்ணப்பிப்பது எப்படி?",
      btnShowEligibleGlobal: "தகுதியான திட்டங்களை மட்டும் காட்டு",
      filterAppliedGlobal: "வடிகட்டி பயன்படுத்தப்பட்டது — பக்கத்தைப் பார்க்கவும்",
      noDocInfo: "**{name}** திட்டத்திற்கான தேவையான ஆவணங்கள் தரவுத்தொகுப்பில் குறிப்பிடப்படவில்லை. அதிகாரப்பூர்வ சேவை போர்ட்டலைப் பார்க்கவும்.",
      noApplyInfo: "**{name}** திட்டத்திற்கான விண்ணப்ப விவரங்கள் தரவுத்தொகுப்பில் குறிப்பிடப்படவில்லை. \"முழு விவரங்களையும் காண்க\" என்பதை அழுத்தவும் அல்லது துறை போர்ட்டலைச் சரிபார்க்கவும்.",
      datasetDisclaimer: "(குறிப்பு: திட்டத்தின் விவரங்கள் தரவுத்தளத்தில் உள்ள அசல் மொழியில் கீழே வழங்கப்பட்டுள்ளன)",
      aboutScheme: "பற்றி",
      benefitsFor: "நன்மைகள்",
      eligibilityFor: "தகுதி",
      documentsFor: "தேவையான ஆவணங்கள்",
      applyFor: "விண்ணப்பிக்கும் முறை",
      noBenefitInfo: "**{name}** திட்டத்திற்கான நன்மைகள் விவரங்கள் தரவுத்தொகுப்பில் குறிப்பிடப்படவில்லை.",
      noEligibilityInfo: "**{name}** திட்டத்திற்கான தகுதி வரம்புகள் தரவுத்தொகுப்பில் குறிப்பிடப்படவில்லை.",
      noDescInfo: "**{name}** திட்டத்திற்கான விளக்க விவரங்கள் தரவுத்தொகுப்பில் குறிப்பிடப்படவில்லை.",
      evalEligible: "தகுதியுடையது",
      evalNotEligible: "தகுதி இல்லை",
      evalInfoNeeded: "தகவல் தேவை",
      evalEligibleReason: "🟢 **தகுதியுடையது** — உங்கள் சுயவிவர விவரங்களின்படி ({profile}), நீங்கள் **{name}** திட்டத்திற்கு தகுதி பெற்றுள்ளீர்கள்.\n\n_காரணம்: {reason}_",
      evalNotEligibleReason: "🔴 **தகுதி இல்லை** — உங்கள் சுயவிவர விவரங்களின்படி ({profile}), நீங்கள் **{name}** திட்டத்திற்கு தகுதி பெறவில்லை.\n\n_காரணம்: {reason}_",
      evalInfoNeededReason: "🟠 **தகவல் தேவை** — **{name}** திட்டத்திற்கான தகுதியைச் சரிபார்க்க உங்கள் சுயவிவர விவரங்கள் போதுமானதாக இல்லை.\n\n_காரணம்: {reason}_",
      searchTitle: "\"{query}\" தேடலுக்குப் பொருந்தும் **{count} திட்டங்களை** நான் கண்டறிந்துள்ளேன்:",
      chipEligible: "எனக்கான தகுதியான திட்டங்கள்",
      queryEligible: "எனக்கு என்ன திட்டங்கள் கிடைக்கும்?",
      chipScholarship: "உதவித்தொகை திட்டங்கள்",
      queryScholarship: "மாணவர்களுக்கான திட்டங்களைக் காட்டு",
      chipWomen: "பெண்களுக்கான திட்டங்கள்",
      queryWomen: "பெண்களுக்கான திட்டங்களைக் காட்டு",
      chipFinancial: "நிதி உதவி திட்டங்கள்",
      queryFinancial: "நிதி உதவி திட்டங்களைக் காட்டு",
      chipFarmer: "விவசாயிகள் திட்டங்கள்",
      queryFarmer: "விவசாயிகள் திட்டங்களைக் காட்டு",
      greetings: ['வணக்கம்', 'ஹலோ', 'ஹாய்', 'காலை வணக்கம்', 'மாலை வணக்கம்'],
      thanks: ['நன்றி', 'மிக்க நன்றி', 'ரொம்ப நன்றி'],
      goodbye: ['போய் வருகிறேன்', 'பை', 'டாடா', 'அவ்வளவுதான்', 'மீண்டும் சந்திப்போம்'],
      casuals: ['எப்படி இருக்கிறீர்கள்', 'உன்னால் என்ன செய்ய முடியும்', 'நீ யார்', 'உன் வேலை என்ன'],
      eligibility: ['தகுதி', 'எனக்கு என்ன திட்டங்கள் கிடைக்கும்', 'நான் எந்த திட்டங்களுக்கு தகுதியானவன்', 'தகுதியான திட்டங்கள்', 'தகுதி உள்ளதா', 'எனக்கு என்ன திட்டங்கள் கிடைக்கின்றன'],
      benefits: ['பயன்கள்', 'நன்மைகள்', 'என்ன கிடைக்கும்', 'விவரங்கள்'],
      eligibilityCriteria: ['யார் விண்ணப்பிக்கலாம்', 'விண்ணப்பிக்க தகுதி', 'தகுதி வரம்புகள்'],
      about: ['இந்த திட்டம் என்றால் என்ன', 'இதை விளக்கவும்', 'விளக்கம்'],
      documents: ['ஆவணங்கள்', 'என்ன ஆவணங்கள்', 'தேவையான ஆவணங்கள்', 'என்ன தயார் செய்ய வேண்டும்', 'ஆவணம்'],
      apply: ['விண்ணப்பிப்பது எப்படி', 'எப்படி விண்ணப்பிப்பது', 'எங்கு விண்ணப்பிக்க வேண்டும்', 'விண்ணப்ப முறை', 'பதிவு செய்வது எப்படி'],
      jobs: ['அரசு வேலை', 'வேலைகள்', 'காலியிடங்கள்', 'வேலை தேடு', 'வேலைவாய்ப்பு'],
      profile: ['சுயவிவரம்', 'சுயவிவரத்தைக் காட்டு', 'என் வயது', 'என் மாநிலம்', 'என் வருமானம்', 'சுய விவரம்'],
      search: [
        'உதவித்தொகை', 'மாணவர்', 'படிப்பு', 'கல்வி', 'பள்ளி', 'கல்லூரி',
        'பெண்கள்', 'பெண்', 'மகளிர்', 'சிறுமி',
        'விவசாயி', 'விவசாயம்', 'பயிர்', 'கிசான்', 'மீனவர்', 'கிராமப்புற',
        'நிதி', 'பணம்', 'உதவி', 'ஓய்வூதியம்',
        'மாற்றுத்திறனாளி', 'ஊனம்',
        'முதியவர்', 'வயதானவர்', 'ஓய்வு பெற்ற',
        'வணிகம்', 'தொழில்', 'ಸ್ಟಾರ್ಟ್ಅಪ್', 'வியாபாரம்',
        'வீடு', 'வீட்டு கடன்', 'இருப்பிடம்', 'ஆவாஸ்'
      ]
    },
    hi: {
      langName: "हिन्दी",
      title: "OneConnect AI",
      subtitle: "आपकी सरकारी सेवा सहायक",
      placeholder: "सरकारी योजनाओं के बारे में पूछें...",
      statusOnline: "ऑनलाइन",
      closeBtn: "OneConnect AI सहायक बंद करें",
      sendBtn: "संदेश भेजें",
      welcome: "नमस्ते! मैं OneConnect AI सहायक हूँ 👋\nमैं आपकी पात्रता जांचने, योजनाओं को खोजने और आवेदन करने में मदद कर सकता हूँ।\n\nनीचे दिए गए सुझावों में से किसी एक को चुनें या अपना प्रश्न लिखें।",
      welcomeProfile: "नमस्ते! मैं OneConnect AI सहायक हूँ 👋\nमैं आपकी प्रोफ़ाइल देख सकता हूँ ({profile})। मैं पात्रता जांचने, योजनाओं को खोजने और आवेदन करने में मदद कर सकता हूँ।\n\nनीचे दिए गए सुझावों में से किसी एक को चुनें या अपना प्रश्न लिखें।",
      greetingResponse: "नमस्ते! 👋 मैं OneConnect AI हूँ, आपकी सरकारी सेवा सहायक।\n\nमैं सरकारी योजनाओं, पात्रता, आवश्यक दस्तावेज़, आवेदन प्रक्रिया और सरकारी नौकरियों के बारे में आपकी सहायता कर सकती हूँ।\n\nमैं आपकी कैसे मदद कर सकती हूँ?",
      thanksResponse: "आपका स्वागत है! 😊 मुझे आपकी मदद करके खुशी हुई। आप कभी भी मुझसे योजनाओं, पात्रता, दस्तावेज़ों या सरकारी नौकरियों के बारे में पूछ सकते हैं।",
      goodbyeResponse: "आपका स्वागत है! 👋 जब भी मदद की आवश्यकता हो, वापस आएं।",
      casualResponse: "मैं OneConnect AI 🤖 हूँ। मैं सरकारी योजनाओं की खोज करने, पात्रता जांचने, लाभों और दस्तावेज़ों को समझाने और नौकरियों को खोजने में मदद कर सकती हूँ।",
      fallbackResponse: "मैं सरकारी योजनाओं, पात्रता, दस्तावेज़ों, आवेदन और सरकारी नौकरियों के बारे में मदद कर सकती हूँ।\n\nये पूछने का प्रयास करें:\n• मैं किन योजनाओं के लिए पात्र हूँ?\n• छात्रों के लिए छात्रवृत्ति योजनाएं दिखाएं\n• मुझे कौन से दस्तावेज़ चाहिए?\n• मैं आवेदन कैसे करूं?\n• मेरे लिए सरकारी नौकरियां खोजें",
      noEligible: "मैंने आपकी प्रोफ़ाइल ({profile}) की जांच की है लेकिन कोई पात्र योजना नहीं मिली। कृपया सटीक मिलान के लिए अपनी प्रोफ़ाइल पूरी करें।",
      foundEligible: "आपकी प्रोफ़ाइल ({profile}) के आधार पर, मुझे **{count} पात्र योजनाएं** मिली हैं।{filtered}",
      filteredText: " मुख्य पृष्ठ की सूची को फ़िल्टर कर दिया गया है।",
      jobsResponse: "आप मुख्य नेविगेशन पैनल पर उपलब्ध **सरकारी नौकरियों** को देख सकते हैं। वहाँ रिक्तियां, पात्रता, और आवेदन लिंक उपलब्ध हैं।\n\nक्या आप चाहते हैं कि मैं योजनाओं को खोजने में मदद करूँ?",
      profileHeader: "**आपकी सक्रिय प्रोफ़ाइल विवरण यहाँ है:**",
      profileAge: "आयु",
      profileState: "राज्य",
      profileGender: "लिंग",
      profileOccupation: "व्यवसाय",
      profileIncome: "आय",
      profilePwD: "दिव्यांगता (PwD)",
      profileYes: "हाँ",
      profileNo: "नहीं",
      profileFooter: "आप इन विवरणों को ऊपर 'प्रोफ़ाइल संपादित करें' बटन से बदल सकते हैं।",
      noActiveSchemeDoc: "कृपया दस्तावेज़ जानने के लिए पहले कोई योजना चुनें। आप किसी भी कार्ड पर 'विवरण देखें' पर क्लिक कर सकते हैं।",
      noActiveSchemeApply: "आवेदन करने के लिए:\n1. योजना कार्ड पर जाएँ।\n2. 'विवरण देखें' पर क्लिक करें।\n3. आवश्यक दस्तावेज़ इकट्ठा करके आवेदन करें।",
      schemeLevelCentral: "केंद्र सरकार",
      schemeLevelState: "योजना",
      eligibleTag: "पात्र",
      viewDetails: "विवरण देखें →",
      viewFullDetails: "पूरा विवरण देखें →",
      btnEligible: "क्या मैं पात्र हूँ?",
      btnDocuments: "आवश्यक दस्तावेज़",
      btnApply: "आवेदन कैसे करें?",
      btnShowEligibleGlobal: "केवल पात्र योजनाएं दिखाएं",
      filterAppliedGlobal: "फ़िल्टर लागू किया गया — पृष्ठ देखें",
      noDocInfo: "**{name}** के लिए आवश्यक दस्तावेज़ डेटासेट में निर्दिष्ट नहीं हैं। कृपया आधिकारिक पोर्टल देखें।",
      noApplyInfo: "**{name}** के लिए आवेदन प्रक्रिया डेटासेट में निर्दिष्ट नहीं है। 'विवरण देखें' पर जाएँ या विभाग पोर्टल देखें।",
      datasetDisclaimer: "(नोट: योजना का विवरण मूल डेटाबेस भाषा में नीचे दिया गया है)",
      aboutScheme: "विवरण",
      benefitsFor: "लाभ",
      eligibilityFor: "पात्रता",
      documentsFor: "आवश्यक दस्तावेज़",
      applyFor: "आवेदन कैसे करें",
      noBenefitInfo: "**{name}** के लिए लाभ विवरण डेटासेट में उपलब्ध नहीं है।",
      noEligibilityInfo: "**{name}** के लिए पात्रता नियम डेटासेट में उपलब्ध नहीं हैं।",
      noDescInfo: "**{name}** के लिए विवरण डेटासेट में उपलब्ध नहीं है।",
      evalEligible: "पात्र",
      evalNotEligible: "अपात्र",
      evalInfoNeeded: "जानकारी आवश्यक",
      evalEligibleReason: "🟢 **पात्र** — आपकी प्रोफ़ाइल ({profile}) के आधार पर, आप **{name}** के लिए पात्र हैं।\n\n_कारण: {reason}_",
      evalNotEligibleReason: "🔴 **अपात्र** — आपकी प्रोफ़ाइल ({profile}) के आधार पर, आप **{name}** के लिए पात्र नहीं हैं।\n\n_कारण: {reason}_",
      evalInfoNeededReason: "🟠 **जानकारी आवश्यक** — **{name}** के लिए पात्रता की जांच करने के लिए आपकी प्रोफ़ाइल की जानकारी पर्याप्त नहीं है।\n\n_कारण: {reason}_",
      searchTitle: "\"{query}\" से मेल खाने वाली **{count} योजनाएं** मिली हैं:",
      chipEligible: "मेरे लिए पात्र योजनाएं",
      queryEligible: "मैं किन सरकारी योजनाओं के लिए पात्र हूँ?",
      chipScholarship: "छात्रवृत्ति योजनाएं",
      queryScholarship: "छात्रों के लिए छात्रवृत्ति योजनाएं दिखाएं",
      chipWomen: "महिलाओं के लिए योजनाएं",
      queryWomen: "महिलाओं के लिए योजनाएं खोजें",
      chipFinancial: "वित्तीय सहायता",
      queryFinancial: "कौन सी योजनाएं वित्तीय सहायता प्रदान करती हैं?",
      chipFarmer: "किसान योजनाएं",
      queryFarmer: "किसानों के लिए योजनाएं दिखाएं",
      greetings: ['hi', 'hello', 'hey', 'नमस्ते', 'नमस्कार', 'हेलो', 'हाय'],
      thanks: ['धन्यवाद', 'शुक्रिया', 'थैंक यू', 'थैंक्स'],
      goodbye: ['अलविदा', 'बाय', 'टाटा', 'ओके बाय', 'अलविदा'],
      casuals: ['आप कैसे हैं', 'तुम क्या कर सकते हो', 'आप कौन हैं', 'क्या काम करते हो'],
      eligibility: ['पात्र', 'योग्यता', 'मैं किन योजनाओं के लिए पात्र हूँ', 'मेरे लिए योजनाएं', 'पात्रता', 'मैं किन सरकारी योजनाओं के लिए पात्र हूँ'],
      benefits: ['लाभ', 'फायदे', 'क्या मिलता है', 'विवरण'],
      eligibilityCriteria: ['कौन आवेदन कर सकता है', 'कौन पात्र है', 'पात्रता मानदंड'],
      about: ['यह योजना क्या है', 'इस योजना के बारे में बताएं', 'विवरण'],
      documents: ['दस्तावेज़', 'कागजात', 'दस्तावेज', 'क्या चाहिए'],
      apply: ['कैसे आवेदन करें', 'आवेदन कैसे करूं', 'आवेदन प्रक्रिया', 'रजिस्ट्रेशन कैसे करें'],
      jobs: ['नौकरी', 'सरकारी नौकरी', 'रिक्तियां', 'काम', 'नौकरियां'],
      profile: ['प्रोफाइल', 'प्रोफ़ाइल', 'मेरी प्रोफाइल', 'मेरी आयु', 'मेरा राज्य', 'मेरा व्यवसाय', 'मेरी आय'],
      search: [
        'छात्र', 'शिक्षा', 'स्कूल', 'कॉलेज', 'छात्रवृत्ति', 'पढ़ाई',
        'महिला', 'लड़की', 'स्त्री',
        'किसान', 'कृषि', 'फसल', 'खेती',
        'सहायता', 'पैसे', 'पेंशन', 'राहत',
        'विकलांग', 'दिव्यांग', 'दिव्यांगता',
        'वरिष्ठ', 'बुजुर्ग', 'पेंशन',
        'व्यापार', 'उद्योग', 'स्टार्टअप', 'उद्यमी',
        'आवास', 'घर', 'लोन', 'शेल्टर'
      ]
    },
    te: {
      langName: "తెలుగు",
      title: "OneConnect AI",
      subtitle: "మీ ప్రభుత్వ సేవల సహాయకురాలు",
      placeholder: "ప్రభుత్వ పథకాల గురించి అడగండి...",
      statusOnline: "ఆన్‌లైన్",
      closeBtn: "సహాయకురాలిని మూసివేయి",
      sendBtn: "సందేశం పంపు",
      welcome: "నమస్తే! నేను OneConnect AI సహాయకురాలిని 👋\nపథకాలు కనుగొనడం, అర్హత తనిఖీ మరియు దరఖాస్తులో సహాయం చేయగలను.\n\nక్రింది సూచనలలో ఒకదాన్ని ఎంచుకోండి లేదా మీ ప్రశ్న రాయండి.",
      welcomeProfile: "నమస్తే! నేను OneConnect AI సహాయకురాలిని 👋\nనేను మీ ప్రొఫైల్ చూడగలను ({profile}). పథకాలు కనుగొనడం, అర్హత తనిఖీ మరియు దరఖాస్తులో సహాయం చేయగలను.\n\nక్రింది సూచనలలో ఒకదాన్ని ఎంచుకోండి లేదా మీ ప్రశ్న రాయండి.",
      greetingResponse: "నమస్తే! 👋 నేను OneConnect AI, మీ ప్రభుత్వ సేవల సహాయకురాలిని.\n\nప్రభుత్వ పథకాలు, అర్హత, కావలసిన పత్రాలు, దరఖాస్తు విధానం మరియు ప్రభుత్వ ఉద్యోగాల సమాచారం అందించగలను.\n\nనేను మీకు ఎలా సహాయం చేయగలను?",
      thanksResponse: "ధన్యవాదాలు! 😊 మీకు సహాయం చేయడం సంతోషంగా ఉంది. పథకాలు, అర్హత, పత్రాలు లేదా ఉద్యోగాల గురించి ఎప్పుడైనా అడగవచ్చు.",
      goodbyeResponse: "ధన్యవాదాలు! 👋 అవసరమైనప్పుడు మళ్ళీ రండి.",
      casualResponse: "నేను OneConnect AI 🤖. ప్రభుత్వ పథకాలను శోధించడం, అర్హత తనిఖీ చేయడం, ప్రయోజనాలు వివరించడం మరియు ఉద్యోగాలను కనుగొనడంలో సహాయపడతాను.",
      fallbackResponse: "ప్రభుత్వ పథకాలు, అర్హత, పత్రాలు, దరఖాస్తు మరియు ప్రభుత్వ ఉద్యోగాల గురించి సహాయం చేయగలను.\n\nఇలా అడగడానికి ప్రయత్నించండి:\n• నాకు ఏ పథకాలు అర్హత ఉన్నాయి?\n• విద్యార్థుల స్కాలర్‌షిప్ పథకాలను చూపించు\n• నాకు ఏ పత్రాలు అవసరం?\n• నేను ఎలా దరఖాస్తు చేసుకోవాలి?\n• నాకు ప్రభుత్వ ఉద్యోగాలను కనుగొనండి",
      noEligible: "నేను మీ ప్రొఫైల్ ({profile}) తనిఖీ చేసాను కానీ అర్హత ఉన్న పథకాలు కనుగొనబడలేదు. ప్రొఫైల్ వివరాలు పూర్తి చేయండి.",
      foundEligible: "మీ ప్రొఫైల్ ({profile}) ఆధారంగా, నాకు **{count} అర్హత ఉన్న పథకాలు** లభించాయి.{filtered}",
      filteredText: " ప్రధాన పేజీలోని జాబితా ఫిల్టర్ చేయబడింది.",
      jobsResponse: "మీరు ప్రధాన నావిగేషన్ ప్యానల్ వద్ద అందుబాటులో ఉన్న **ప్రభుత్వ ఉద్యోగాల** వివరాలను చూడవచ్చు. అక్కడ ఖాళీలు, అర్హత మరియు దరఖాస్తు లింకులు ఉన్నాయి.\n\nదానికి బదులుగా పథకాలను శోధించాలా?",
      profileHeader: "**మీ సక్రియ ప్రొఫైల్ వివరాలు ఇక్కడ ఉన్నాయి:**",
      profileAge: "వయస్సు",
      profileState: "రాష్ట్రం",
      profileGender: "లింగం",
      profileOccupation: "ఉద్యోగం/వృత్తి",
      profileIncome: "ఆదాయం",
      profilePwD: "దివ్యాంగులు (PwD)",
      profileYes: "అవును",
      profileNo: "కాదు",
      profileFooter: "మీరు ఈ వివరాలను పైన ఉన్న 'ప్రొఫైల్ సవరించు' బటన్ ద్వారా ఎప్పుడైనా మార్చుకోవచ్చు.",
      noActiveSchemeDoc: "పత్రాలు తెలుసుకోవడానికి దయచేసి పథకం ఎంచుకోండి. ఏదైనాカードపై 'వివరాలు చూడు' క్లిక్ చేయవచ్చు.",
      noActiveSchemeApply: "దరఖాస్తు చేయడానికి:\n1. పథకం కార్డుకు వెళ్ళండి.\n2. 'వివరాలు చూడు' క్లిక్ చేయండి.\n3. కావలసిన పత్రాలు సేకరించి దరఖాస్తు చేయండి.",
      schemeLevelCentral: "కేంద్ర ప్రభుత్వం",
      schemeLevelState: "పథకం",
      eligibleTag: "అర్హత ఉంది",
      viewDetails: "వివరాలు చూడు →",
      viewFullDetails: "పూర్తి వివరాలు చూడు →",
      btnEligible: "నాకు అర్హత ఉందా?",
      btnDocuments: "కావలసిన పత్రాలు",
      btnApply: "దరఖాస్తు ఎలా చేయాలి?",
      btnShowEligibleGlobal: "అర్హత ఉన్న పథకాలను మాత్రమే చూపించు",
      filterAppliedGlobal: "ఫిల్టర్ వర్తింపజేయబడింది — పేజీ చూడండి",
      noDocInfo: "**{name}** కొరకు కావలసిన పత్రాలు డేటాసెట్‌లో పేర్కొనబడలేదు. అధికారిక పోర్టల్ చూడండి.",
      noApplyInfo: "**{name}** కొరకు దరఖాస్తు వివరాలు డేటాసెట్‌లో పేర్కొనబడలేదు. 'పూర్తి వివరాలు చూడు' క్లిక్ చేయండి.",
      datasetDisclaimer: "(గమనిక: పథకం వివరాలు డేటాబేస్ అసలు భాషలోనే క్రింద ఇవ్వబడ్డాయి)",
      aboutScheme: "పథకం గురించి",
      benefitsFor: "ప్రయోజనాలు",
      eligibilityFor: "అర్హత",
      documentsFor: "కావలసిన పత్రాలు",
      applyFor: "దరఖాస్తు విధానం",
      noBenefitInfo: "**{name}** పథకం ప్రయోజనాల వివరాలు డేటాసెట్‌లో లభించలేదు.",
      noEligibilityInfo: "**{name}** పథకం అర్హత నిబంధనలు డేటాసెట్‌లో లభించలేదు.",
      noDescInfo: "**{name}** పథకం వివరణ డేటాసెట్‌లో లభించలేదు.",
      evalEligible: "అర్హత ఉంది",
      evalNotEligible: "అర్హత లేదు",
      evalInfoNeeded: "సమాచారం అవసరం",
      evalEligibleReason: "🟢 **అర్హత ఉంది** — మీ ప్రొఫైల్ ({profile}) ప్రకారం, మీరు **{name}** పథకానికి అర్హులు.\n\n_కారణం: {reason}_",
      evalNotEligibleReason: "🔴 **అర్హత లేదు** — మీ ప్రొఫైల్ ({profile}) ప్రకారం, మీరు **{name}** పథకానికి అర్హులు కారు.\n\n_కారణం: {reason}_",
      evalInfoNeededReason: "🟠 **సమాచారం అవసరం** — **{name}** పథకానికి అర్హత తనిఖీ చేయడానికి మీ ప్రొఫైల్ సమాచారం సరిపోదు.\n\n_కారణం: {reason}_",
      searchTitle: "\"{query}\" శోధనకు సరిపోలే **{count} పథకాలు** లభించాయి:",
      chipEligible: "నాకు అర్హత ఉన్న పథకాలు",
      queryEligible: "నాకు ఏ ప్రభుత్వ పథకాలు అందుబాటులో ఉన్నాయి?",
      chipScholarship: "స్కాలర్‌షిప్ పథకాలు",
      queryScholarship: "విద్యార్థుల స్కాలర్‌షిప్ పథకాలను చూపించు",
      chipWomen: "మహిళల పథకాలు",
      queryWomen: "మహిళల పథకాలు చూపించు",
      chipFinancial: "ఆర్థిక సహాయం",
      queryFinancial: "ఆర్థిక సహాయం పథకాలు ఏవి?",
      chipFarmer: "రైతు పథకాలు",
      queryFarmer: "రైతుల పథకాలు చూపించు",
      greetings: ['hi', 'hello', 'hey', 'నమస్తే', 'నమస్కారం', 'హలో', 'హాయ్'],
      thanks: ['ధన్యవాదాలు', 'థాంక్స్', 'థాంక్యూ'],
      goodbye: ['సెలవు', 'బై', 'టాటా', 'వెళ్ళివస్తా'],
      casuals: ['ఎలా ఉన్నారు', 'నువ్వు ఏం చేయగలవు', 'నువ్వు ఎవరు', 'నీ పని ఏమిటి'],
      eligibility: ['అర్హత', 'నాకు ఏ ప్రభుత్వ పథకాలు అందుబాటులో ఉన్నాయి', 'అర్హత ఉందా', 'అర్హత ఉన్న పథకాలు'],
      benefits: ['ప్రయోజనాలు', 'లాభాలు', 'ఏమి వస్తుంది', 'వివరాలు'],
      eligibilityCriteria: ['ఎవరు దరఖాస్తు చేయవచ్చు', 'అర్హత ప్రమాణాలు'],
      about: ['ఈ పథకం ఏమిటి', 'పథకం గురించి వివరించు'],
      documents: ['పత్రాలు', 'కాగితాలు', 'ఏ పత్రాలు అవసరం', 'పత్రం'],
      apply: ['దరఖాస్తు ఎలా చేయాలి', 'ఎలా దరఖాస్తు చేసుకోవాలి', 'దరఖాస్తు విధానం'],
      jobs: ['ఉద్యోగం', 'ప్రభుత్వ ఉద్యోగాలు', 'ఖాళీలు', 'పని', 'ఉద్యోగాలు'],
      profile: ['ప్రొఫైల్', 'నా ప్రొఫైల్', 'నా వయస్సు', 'నా రాష్ట్రం', 'నా ఆదాయం'],
      search: [
        'విద్యార్థి', 'విద్య', 'పాఠశాల', 'స్కాలర్‌షిప్',
        'महिला', 'స్త్రీ', 'అమ్మాయి',
        'రైతు', 'వ్యవసాయం', 'పంట',
        'సహాయం', 'డబ్బు', 'పెన్షన్',
        'వికలాంగులు', 'దివ్యాంగులు',
        'వృద్ధులు', 'పెన్షన్',
        'వ్యాపారం', 'పరిశ్రమ', 'స్టార్టప్',
        'ఇల్లు', 'ఆవాస్'
      ]
    },
    kn: {
      langName: "ಕನ್ನಡ",
      title: "OneConnect AI",
      subtitle: "ನಿಮ್ಮ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಸಹಾಯಕಿ",
      placeholder: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
      statusOnline: "ಆನ್‌ಲೈನ್",
      closeBtn: "ಸಹಾಯಕಿ ಮುಚ್ಚಿ",
      sendBtn: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
      welcome: "ನಮಸ್ತೆ! ನಾನು OneConnect AI ಸಹಾಯಕಿ 👋\nಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು, ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.\n\nಕೆಳಗಿನ ಸಲಹೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ.",
      welcomeProfile: "ನಮಸ್ತೆ! ನಾನು OneConnect AI ಸಹಾಯಕಿ 👋\nನಾನು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ನೋಡಬಲ್ಲೆ ({profile}). ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು, ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.\n\nಕೆಳಗಿನ ಸಲಹೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ.",
      greetingResponse: "ನಮಸ್ತೆ! 👋 ನಾನು OneConnect AI, ನಿಮ್ಮ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಸಹಾಯಕಿ.\n\nಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಅರ್ಹತೆ, ಬೇಕಾದ ದಾಖಲೆಗಳು, ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ ಮತ್ತು ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಬಲ್ಲೆ.\n\nನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
      thanksResponse: "ನಿಮಗೆ ಸ್ವಾಗತ! 😊 ಸಹಾಯ ಮಾಡಲು ಸಂತೋಷವಾಗಿದೆ. ಯೋಜನೆಗಳು, ಅರ್ಹತೆ, ದಾಖಲೆಗಳು ಅಥವಾ ಉದ್ಯೋಗಗಳ ಬಗ್ಗೆ ಯಾವಾಗ ಬೇಕಾದರೂ ಕೇಳಬಹುದು.",
      goodbyeResponse: "ಧನ್ಯವಾದಗಳು! 👋 ಸಹಾಯ ಬೇಕಾದಾಗ ಯಾವಾಗ ಬೇಕಾದರೂ ಮರಳಿ ಬನ್ನಿ.",
      casualResponse: "ನಾನು OneConnect AI 🤖. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು, ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು, ದಾಖಲೆಗಳನ್ನು ವಿವರವಾಗಿ ತಿಳಿಸಲು ಮತ್ತು ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
      fallbackResponse: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಅರ್ಹತೆ, ದಾಖಲೆಗಳು, ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಮತ್ತು ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಬಲ್ಲೆ.\n\nಇವುಗಳನ್ನು ಕೇಳಿ ನೋಡಿ:\n• ನಾನು ಯಾವ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹನು?\n• ವಿದ್ಯಾರ್ಥಿಗಳ ವಿದ್ಯಾರ್ಥಿವೇತನ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಿ\n• ನನಗೆ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?\n• ನಾನು ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು?\n• ನನಗೆ ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಿ",
      noEligible: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ({profile}) ಪರಿಶೀಲಿಸಿದ್ದೇನೆ ಆದರೆ ಯಾವುದೇ ಅರ್ಹ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
      foundEligible: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ({profile}) ಆಧಾರದ ಮೇಲೆ, ನನಗೆ **{count} ಅರ್ಹ ಯೋಜನೆಗಳು** ದೊರೆತಿವೆ.{filtered}",
      filteredText: " ಮುಖ್ಯ ಪುಟದಲ್ಲಿರುವ ಪಟ್ಟಿಯನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಲಾಗಿದೆ.",
      jobsResponse: "ನೀವು ಮುಖ್ಯ ನ್ಯಾವಿಗೇಷನ್ ಪ್ಯಾನೆಲ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರುವ **ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳನ್ನು** ನೋಡಬಹುದು. ಅಲ್ಲಿ ಖಾಲಿ ಹುದ್ದೆಗಳು, ಅರ್ಹತೆ ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಲಿಂಕ್‌ಗಳಿವೆ.\n\nಇದರ ಬದಲಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಮಾಡಬೇಕೇ?",
      profileHeader: "**ನಿಮ್ಮ sಕ್ರಿಯ ಪ್ರೊಫೈಲ್ ವಿವರಗಳು ಇಲ್ಲಿವೆ:**",
      profileAge: "ವಯಸ್ಸು",
      profileState: "ರಾಜ್ಯ",
      profileGender: "ಲಿಂಗ",
      profileOccupation: "ವೃತ್ತಿ/ಉದ್ಯೋಗ",
      profileIncome: "ಆದಾಯ",
      profilePwD: "ವಿಕಲಚೇತನರು (PwD)",
      profileYes: "ಹೌದು",
      profileNo: "ಇಲ್ಲ",
      profileFooter: "ಮೇಲಿರುವ 'ಪ್ರೊಫೈಲ್ ತಿದ್ದಿ' ಬಟನ್ ಬಳಸಿ ಈ ವಿವರಗಳನ್ನು ಯಾವಾಗ ಬೇಕಾದರೂ ಬದಲಾಯಿಸಬಹುದು.",
      noActiveSchemeDoc: "ದಾಖಲೆಗಳನ್ನು ತಿಳಿಯಲು ದಯವಿಟ್ಟು ಯೋಜನೆ ಆರಿಸಿ. ಯಾವುದೇ ಕಾರ್ಡ್‌ನಲ್ಲಿ 'ವಿವರ ನೋಡಿ' ಕ್ಲಿಕ್ ಮಾಡಬಹುದು.",
      noActiveSchemeApply: "ಅರ್ಜಿ ಸಲ್ಲಿಸಲು:\n1. ಯೋಜನೆ ಕಾರ್ಡ್ ನೋಡಿ.\n2. 'ವಿವರ ನೋಡಿ' ಕ್ಲಿಕ್ ಮಾಡಿ.\n3. ಬೇಕಾದ ದಾಖಲೆ ಸಂಗ್ರಹಿಸಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
      schemeLevelCentral: "ಕೇಂದ್ರ ಸರ್ಕಾರ",
      schemeLevelState: "ಯೋಜನೆ",
      eligibleTag: "ಅರ್ಹತೆ ಇದೆ",
      viewDetails: "ವಿವರ ನೋಡಿ →",
      viewFullDetails: "ಪೂರ್ಣ ವಿವರ ನೋಡಿ →",
      btnEligible: "ನನಗೆ ಅರ್ಹತೆ ಇದೆಯೇ?",
      btnDocuments: "ಬೇಕಾದ ದಾಖಲೆಗಳು",
      btnApply: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?",
      btnShowEligibleGlobal: "ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಿ",
      filterAppliedGlobal: "ಫಿಲ್ಟರ್ ಅನ್ವಯಿಸಲಾಗಿದೆ — ಪುಟ ನೋಡಿ",
      noDocInfo: "**{name}** ಗಾಗಿ ಬೇಕಾದ ದಾಖಲೆಗಳನ್ನು ಡೇಟಾಸೆಟ್‌ನಲ್ಲಿ ತಿಳಿಸಲಾಗಿಲ್ಲ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ನೋಡಿ.",
      noApplyInfo: "**{name}** ಗಾಗಿ ಅರ್ಜಿ ವಿವರಗಳನ್ನು ಡೇಟಾಸೆಟ್‌ನಲ್ಲಿ ತಿಳಿಸಲಾಗಿಲ್ಲ. 'ಪೂರ್ಣ ವಿವರ ನೋಡಿ' ಕ್ಲಿಕ್ ಮಾಡಿ.",
      datasetDisclaimer: "(ಗಮನಿಸಿ: ಯೋಜನೆಯ ವಿವರಗಳನ್ನು ಡೇಟಾಬೇಸ್‌ನ ಮೂಲ ಭಾಷೆಯಲ್ಲೇ ಕೆಳge ನೀಡಲಾಗಿದೆ)",
      aboutScheme: "ಯೋಜನೆ ಬಗ್ಗೆ",
      benefitsFor: "ಪ್ರಯೋಜನಗಳು",
      eligibilityFor: "ಅರ್ಹತೆ",
      documentsFor: "ಬೇಕಾದ ದಾಖಲೆಗಳು",
      applyFor: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ",
      noBenefitInfo: "**{name}** ಯೋಜನೆಯ ಪ್ರಯೋಜನಗಳ ವಿವರ ಡೇಟಾಸೆಟ್‌ನಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.",
      noEligibilityInfo: "**{name}** ಯೋಜನೆಯ ಅರ್ಹತಾ ನಿಯಮಗಳು ಡೇಟಾಸೆಟ್‌ನಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.",
      noDescInfo: "**{name}** ಯೋಜನೆಯ ವಿವರಣೆ ಡೇಟಾಸೆಟ್‌ನಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.",
      evalEligible: "ಅರ್ಹತೆ ಇದೆ",
      evalNotEligible: "ಅರ್ಹತೆ ಇಲ್ಲ",
      evalInfoNeeded: "ಮಾಹಿತಿ ಅಗತ್ಯ",
      evalEligibleReason: "🟢 **ಅರ್ಹತೆ ಇದೆ** — ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ({profile}) ಪ್ರಕಾರ, ನೀವು **{name}** ಯೋಜನೆಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ.\n\n_ಕಾರಣ: {reason}_",
      evalNotEligibleReason: "🔴 **ಅರ್ಹತೆ ಇಲ್ಲ** — ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ({profile}) ಪ್ರಕಾರ, ನೀವು **{name}** ಯೋಜನೆಗೆ ಅರ್ಹರಲ್ಲ.\n\n_ಕಾರಣ: {reason}_",
      evalInfoNeededReason: "🟠 **ಮಾಹಿತಿ ಅಗತ್ಯ** — **{name}** ಯೋಜನೆಗೆ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ ಸಾಕಾಗುವುದಿಲ್ಲ.\n\n_ಕಾರಣ: {reason}_",
      searchTitle: "\"{query}\" ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ **{count} ಯೋಜನೆಗಳು** ದೊರೆತಿವೆ:",
      chipEligible: "ನನಗೆ ಅರ್ಹವಿರುವ ಯೋಜನೆಗಳು",
      queryEligible: "ನಾನು ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹನು?",
      chipScholarship: "ವಿದ್ಯಾರ್ಥಿವೇತನ ಯೋಜನೆಗಳು",
      queryScholarship: "ವಿದ್ಯಾರ್ಥಿಗಳ ವಿದ್ಯಾರ್ಥಿವೇತನ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಿ",
      chipWomen: "ಮಹಿಳೆಯರ ಯೋಜನೆಗಳು",
      queryWomen: "ಮಹಿಳೆಯರ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
      chipFinancial: "ಆರ್ಥಿಕ ನೆರವು",
      queryFinancial: "ಯಾವ ಯೋಜನೆಗಳು ಆರ್ಥಿಕ ನೆರವು ನೀಡುತ್ತವೆ?",
      chipFarmer: "ರೈತ ಯೋಜನೆಗಳು",
      queryFarmer: "ರೈತರಿಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಿ",
      greetings: ['hi', 'hello', 'hey', 'ನಮಸ್ತೆ', 'ನಮಸ್ಕಾರ', 'ಹಲೋ', 'ಹಾಯ್'],
      thanks: ['ಧನ್ಯವಾದಗಳು', 'ಥ್ಯಾಂಕ್ಸ್', 'ಥ್ಯಾಂಕ್ಯೂ'],
      goodbye: ['ಹೋಗಿ ಬರುತ್ತೇನೆ', 'ಬೈ', 'ಟಾಟಾ', 'ಮುಗಿಯಿತು'],
      casuals: ['ಹೇಗಿದ್ದೀರಾ', 'ನೀನು ಏನು ಮಾಡಬಲ್ಲೆ', 'ನೀನು ಯಾರು', 'ನಿನ್ನ ಕೆಲಸ ಏನು'],
      eligibility: ['ಅರ್ಹತೆ', 'ನಾನು ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹನು', 'ಅರ್ಹತೆಯೇ', 'ಅರ್ಹ ಯೋಜನೆಗಳು'],
      benefits: ['ಪ್ರಯೋಜನಗಳು', 'ಲಾಭಗಳು', 'ಏನು ಸಿಗುತ್ತದೆ', 'ವಿವರಗಳು'],
      eligibilityCriteria: ['ಯಾರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು', 'ಅರ್ಹತಾ ಮಾನದಂಡಗಳು'],
      about: ['ಈ ಯೋಜನೆ ಎಂದರೇನು', 'ಯೋಜನೆಯ ಬಗ್ಗೆ ವಿವರಿಸಿ'],
      documents: ['ದಾಖಲೆಗಳು', 'ಕಾಗದಪತ್ರಗಳು', 'ಬೇಕಾದ ದಾಖಲೆಗಳು', 'ದಾಖಲೆ'],
      apply: ['ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ', 'ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು', 'ಅರ್ಜಿ ವಿಧಾನ'],
      jobs: ['ಉದ್ಯೋಗ', 'ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳು', 'ಖಾಲಿ ಹುದ್ದೆಗಳು', 'ಕೆಲಸ', 'ಉದ್ಯೋಗಗಳು'],
      profile: ['ಪ್ರೊಫೈಲ್', 'ನನ್ನ ಪ್ರೊಫೈಲ್', 'ನನ್ನ ವಯಸ್ಸು', 'ನನ್ನ ರಾಜ್ಯ', 'ನನ್ನ ಆದಾಯ'],
      search: [
        'ವಿದ್ಯಾರ್ಥಿ', 'ಶಿಕ್ಷಣ', 'ಶಾಲೆ', 'ವಿದ್ಯಾರ್ಥಿವೇತನ',
        'ಮಹಿಳೆ', 'ಹುಡುಗಿ',
        'ರೈತ', 'ಕೃಷಿ', 'ಬೆಳೆ',
        'ನೆರವು', 'ಹಣ', 'ಪಿಂಚಣಿ',
        'ವಿಕಲಚೇತನರು',
        'ಹಿರಿಯ ನಾಗರಿಕರು',
        'ವ್ಯವಹಾರ', 'ಉದ್ಯಮ',
        'ಮನೆ', 'ವಸತಿ'
      ]
    },
    ml: {
      langName: "മലയാളം",
      title: "OneConnect AI",
      subtitle: "നിങ്ങളുടെ സർക്കാർ സേവന സഹായി",
      placeholder: "സർക്കാർ പദ്ധതികളെക്കുറിച്ച് ചോദിക്കൂ...",
      statusOnline: "ഓൺലൈൻ",
      closeBtn: "സഹായി അടയ്ക്കുക",
      sendBtn: "സന്ദേശം അയക്കുക",
      welcome: "നമസ്കാരം! ഞാൻ OneConnect AI സഹായിയാണ് 👋\nപദ്ധതികൾ കണ്ടെത്താനും അർഹത പരിശോധിക്കാനും അപേക്ഷ നൽകാനും ഞാൻ സഹായിക്കാം.\n\nതാഴെ നൽകിയിട്ടുള്ള നിർദ്ദേശങ്ങളിൽ ഒന്ന് തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ ചോദ്യം ടൈപ്പ് ചെയ്യുക.",
      welcomeProfile: "നമസ്കാരം! ഞാൻ OneConnect AI സഹായിയാണ് 👋\nനിങ്ങളുടെ പ്രൊഫൈൽ എനിക്ക് കാണാം ({profile}). പദ്ധതികൾ കണ്ടെത്താനും അർഹത പരിശോധിക്കാനും അപേക്ഷ നൽകാനും ഞാൻ സഹായിക്കാം.\n\nതാഴെ നൽകിയിട്ടുള്ള നിർദ്ദേശങ്ങളിൽ ഒന്ന് തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ ചോദ്യം ടൈപ്പ് ചെയ്യുക.",
      greetingResponse: "നമസ്കാരം! 👋 ഞാൻ OneConnect AI, നിങ്ങളുടെ സർക്കാർ സേവന സഹായി.\n\nസർക്കാർ പദ്ധതികൾ, അർഹത, ആവശ്യമായ രേഖകൾ, അപേക്ഷാ രീതികൾ, സർക്കാർ ജോലികൾ എന്നിവയെക്കുറിച്ച് സഹായിക്കാം.\n\nഞാൻ നിങ്ങൾക്ക് എങ്ങനെയാണ് സഹായിക്കേണ്ടത്?",
      thanksResponse: "നിങ്ങൾക്ക് സ്വാഗതം! 😊 സഹായിക്കാൻ കഴിഞ്ഞതിൽ സന്തോഷം. പദ്ധതികൾ, അർഹത, രേഖകൾ അല്ലെങ്കിൽ ജോലികൾ എന്നിവയെക്കുറിച്ച് എപ്പോഴും ചോദിക്കാം.",
      goodbyeResponse: "സ്വാഗതം! 👋 സഹായം ആവശ്യമുള്ളപ്പോൾ എപ്പോൾ വേണമെങ്കിലും മടങ്ങിവരാം.",
      casualResponse: "ഞാൻ OneConnect AI 🤖. സർക്കാർ പദ്ധതികൾ കണ്ടെത്താനും അർഹത പരിശോധിക്കാനും രേഖകളെക്കുറിച്ച് വിശദീകരിക്കാനും ജോലികൾ കണ്ടെത്താനും സഹായിക്കാം.",
      fallbackResponse: "സർക്കാർ പദ്ധതികൾ, അർഹത, രേഖകൾ, അപേക്ഷ, സർക്കാർ ജോലികൾ എന്നിവയെക്കുറിച്ച് സഹായിക്കാം.\n\nഇവ ചോദിച്ചു നോക്കൂ:\n• എനിക്ക് ഏത് പദ്ധതികൾക്കാണ് അർഹതയുള്ളത്?\n• വിദ്യാർത്ഥികൾക്കായുള്ള സ്കോളർഷിപ്പ് പദ്ധതികൾ കാണിക്കുക\n• എനിക്ക് എന്തെല്ലാം രേഖകൾ വേണം?\n• ഞാൻ എങ്ങനെ അപേക്ഷിക്കണം?\n• എനിക്ക് സർക്കാർ ജോലികൾ കണ്ടെത്തുക",
      noEligible: "നിങ്ങളുടെ പ്രൊഫൈൽ ({profile}) പരിശോധിച്ചതിൽ നേരിട്ട് അർഹതയുള്ള പദ്ധതികൾ കണ്ടെത്താനായില്ല. വിവരങ്ങൾ പൂർണ്ണമായി നൽകുക.",
      foundEligible: "നിങ്ങളുടെ പ്രൊഫൈൽ ({profile}) അടിസ്ഥാനമാക്കി, എനിക്ക് **{count} അർഹതയുള്ള പദ്ധതികൾ** ലഭിച്ചു.{filtered}",
      filteredText: " പ്രധാന പേജിലെ ലിസ്റ്റ് ഫിൽട്ടർ ചെയ്തിട്ടുണ്ട്.",
      jobsResponse: "പ്രധാന നാവിഗേഷൻ പാനലിൽ ലഭ്യമായ **സർക്കാർ ജോലികൾ** നിങ്ങൾക്ക് പരിശോധിക്കാം. അവിടെ ഒഴിവുകൾ, അർഹത, അപേക്ഷിക്കാനുള്ള ലിങ്കുകൾ എന്നിവയുണ്ട്.\n\nഇതിന് പകരം പദ്ധതികൾ കണ്ടെത്താൻ സഹായിക്കണോ?",
      profileHeader: "**നിങ്ങളുടെ സജീവമായ പ്രൊഫൈൽ വിവരങ്ങൾ താഴെ നൽകുന്നു:**",
      profileAge: "പ്രായം",
      profileState: "സംസ്ഥാനം",
      profileGender: "ലിംഗഭേദം",
      profileOccupation: "ജോലി/തൊഴിൽ",
      profileIncome: "വരുമാനം",
      profilePwD: "ഭിന്നശേഷി (PwD)",
      profileYes: "അതെ",
      profileNo: "അല്ല",
      profileFooter: "മുകളിലുള്ള 'പ്രൊഫൈൽ തിരുത്തുക' ബട്ടൺ ഉപയോഗിച്ച് ഈ വിവരങ്ങൾ എപ്പോൾ വേണമെങ്കിലും മാറ്റാം.",
      noActiveSchemeDoc: "രേഖകൾ അറിയാൻ ദയവായി ഒരു പദ്ധതി തിരഞ്ഞെടുക്കുക. ഏതെങ്കിലും കാർഡിലെ 'വിശദാംശങ്ങൾ കാണുക' ക്ലിക്ക് ചെയ്യാം.",
      noActiveSchemeApply: "അപേക്ഷിക്കാൻ:\n1. പദ്ധതി കാർഡ് കാണുക.\n2. 'വിശദാംശങ്ങൾ കാണുക' ക്ലിക്ക് ചെയ്യുക.\n3. ആവശ്യമായ രേഖകൾ ശേഖരിച്ച് അപേക്ഷിക്കുക.",
      schemeLevelCentral: "കേന്ദ്ര സർക്കാർ",
      schemeLevelState: "പദ്ധതി",
      eligibleTag: "അർഹതയുണ്ട്",
      viewDetails: "വിശദാംശങ്ങൾ കാണുക →",
      viewFullDetails: "പൂർണ്ണ വിവരങ്ങൾ കാണുക →",
      btnEligible: "എനിക്ക് അർഹതയുണ്ടോ?",
      btnDocuments: "ആവശ്യമായ രേഖകൾ",
      btnApply: "എങ്ങനെ അപേക്ഷിക്കണം?",
      btnShowEligibleGlobal: "അർഹതയുള്ള പദ്ധതികൾ മാത്രം കാണിക്കുക",
      filterAppliedGlobal: "ഫിൽട്ടർ ബാധകമാക്കി — പേജ് കാണുക",
      noDocInfo: "**{name}** പദ്ധതിക്കുള്ള രേഖകൾ ഡാറ്റാസെറ്റിൽ വ്യക്തമാക്കിയിട്ടില്ല. ഔദ്യോഗിക പോർട്ടൽ കാണുക.",
      noApplyInfo: "**{name}** പദ്ധതിക്കുള്ള അപേക്ഷാ വിവരങ്ങൾ ഡാറ്റാസെറ്റിൽ വ്യക്തമാക്കിയിട്ടില്ല. 'പൂർണ്ണ വിവരങ്ങൾ കാണുക' ക്ലിക്ക് ചെയ്യുക.",
      datasetDisclaimer: "(ശ്രദ്ധിക്കുക: പദ്ധതിയുടെ വിവരങ്ങൾ ഡാറ്റാബേസിലെ യഥാർത്ഥ ഭാഷയിലാണ് താഴെ നൽകിയിരിക്കുന്നത്)",
      aboutScheme: "പദ്ധതിയെക്കുറിച്ച്",
      benefitsFor: "ആനുകൂല്യങ്ങൾ",
      eligibilityFor: "അർഹത",
      documentsFor: "ആവശ്യമായ രേഖകൾ",
      applyFor: "അപേക്ഷാ രീതി",
      noBenefitInfo: "**{name}** പദ്ധതിയുടെ ആനുകൂല്യ വിവരങ്ങൾ ഡാറ്റാസെറ്റിൽ ലഭ്യമല്ല.",
      noEligibilityInfo: "**{name}** പദ്ധതിയുടെ അർഹതാ നിബന്ധനകൾ ഡാറ്റാസെറ്റിൽ ലഭ്യമല്ല.",
      noDescInfo: "**{name}** പദ്ധതിയുടെ വിവരണം ഡാറ്റാസെറ്റിൽ ലഭ്യമല്ല.",
      evalEligible: "അർഹതയുണ്ട്",
      evalNotEligible: "അർഹതയില്ല",
      evalInfoNeeded: "വിവരം ആവശ്യമാണ്",
      evalEligibleReason: "🟢 **അർഹതയുണ്ട്** — നിങ്ങളുടെ പ്രൊഫൈൽ ({profile}) അനുസരിച്ച്, നിങ്ങൾ **{name}** പദ്ധതിക്ക് അർഹനാണ്.\n\n_കാരണം: {reason}_",
      evalNotEligibleReason: "🔴 **അർഹതയില്ല** — നിങ്ങളുടെ പ്രൊഫൈൽ ({profile}) അനുസരിച്ച്, നിങ്ങൾ **{name}** പദ്ധതിക്ക് അർഹനല്ല.\n\n_കാരണം: {reason}_",
      evalInfoNeededReason: "🟠 **വിവരം ആവശ്യമാണ്** — **{name}** പദ്ധതിക്കുള്ള അർഹത പരിശോധിക്കാൻ നിങ്ങളുടെ പ്രൊഫൈൽ വിവരങ്ങൾ തികയില്ല.\n\n_കാരണം: {reason}_",
      searchTitle: "\"{query}\" തിരച്ചിലിന് അനുയോജ്യമായ **{count} പദ്ധതികൾ** കണ്ടെത്തി:",
      chipEligible: "എനിക്ക് അർഹതയുള്ള പദ്ധതികൾ",
      queryEligible: "എനിക്ക് ഏത് സർക്കാർ പദ്ധതികൾക്ക് അർഹതയുണ്ട്?",
      chipScholarship: "സ്കോളർഷിപ്പ് പദ്ധതികൾ",
      queryScholarship: "വിദ്യാർത്ഥികൾക്കായുള്ള സ്കോളർഷിപ്പ് പദ്ധതികൾ കാണിക്കുക",
      chipWomen: "സ്ത്രീകൾക്കായുള്ള പദ്ധതികൾ",
      queryWomen: "സ്ത്രീകൾക്കായുള്ള പദ്ധതികൾ കണ്ടെത്തുക",
      chipFinancial: "ധനസഹായം",
      queryFinancial: "ധനസഹായ പദ്ധതികൾ ഏവ?",
      chipFarmer: "കർഷക പദ്ധതികൾ",
      queryFarmer: "കർഷകർക്കായുള്ള പദ്ധതികൾ കാണിക്കുക",
      greetings: ['hi', 'hello', 'hey', 'നമസ്കാരം', 'ഹലോ', 'ഹായ്'],
      thanks: ['നന്ദി', 'താങ്ക്സ്', 'താങ്ക്യു'],
      goodbye: ['പോയി വരാം', 'ബൈ', 'ടാറ്റാ', 'കണ്ടു മുട്ടാം'],
      casuals: ['എങ്ങനെയുണ്ട്', 'നിനക്ക് എന്ത് ചെയ്യാൻ കഴിയും', 'നീ ആരാണ്', 'നിന്റെ ജോലി എന്താണ്'],
      eligibility: ['അർഹത', 'എനിക്ക് ഏത് സർക്കാർ പദ്ധതികൾക്ക് അർഹതയുണ്ട്', 'അർഹതയുണ്ടോ', 'അർഹതയുള്ള പദ്ധതികൾ'],
      benefits: ['ആനുകൂല്യങ്ങൾ', 'ഗുണങ്ങൾ', 'എന്ത് ലഭിക്കും', 'വിശദാംശങ്ങൾ'],
      eligibilityCriteria: ['ആർക്കൊക്കെ അപേക്ഷിക്കാം', 'അർഹതാ മാനദണ്ഡങ്ങൾ'],
      about: ['ഈ പദ്ധതി എന്താണ്', 'പദ്ധതി വിവരിക്കുക'],
      documents: ['രേഖകൾ', 'കടലാസുകൾ', 'എന്തെല്ലാം രേഖകൾ വേണം', 'രേഖ'],
      apply: ['എങ്ങനെ അപേക്ഷിക്കണം', 'ഞാൻ എങ്ങനെ അപേക്ഷിക്കണം', 'അപേക്ഷ രീതി'],
      jobs: ['തൊഴിൽ', 'സർക്കാർ ജോലികൾ', 'ഒഴിവുകൾ', 'ജോലി', 'ജോലികൾ'],
      profile: ['പ്രൊഫൈൽ', 'എന്റെ പ്രൊഫൈൽ', 'എന്റെ പ്രായം', 'എന്റെ സംസ്ഥാനം', 'എന്റെ വരുമാനം'],
      search: [
        'വിദ്യാർത്ഥി', 'വിദ്യാഭ്യാസം', 'സ്കോളർഷിപ്പ്',
        'സ്ത്രീ', 'പെൺകുട്ടി',
        'കർഷകൻ', 'കൃഷി',
        'സഹായം', 'പണം', 'പെൻഷൻ',
        'ഭിന്നശേഷി',
        'മുതിർന്ന പൗരന്മാർ',
        'ബിസിനസ്സ്', 'വ്യവസായം',
        'ഭവനം', 'വീട്'
      ]
    }
  };

  // ============================================================
  //  CHATBOT CONTROLLER CLASS
  // ============================================================
  class GovCenterChatbot {
    constructor (options = {}) {
      this.dataset = options.dataset || window.SCHEMES_DATA || [];
      this.onSchemeSelect = options.onSchemeSelect || null;

      // Active Language (Persists in localStorage)
      this.currentLanguage = localStorage.getItem('oneconnect_chat_language') || 'en';

      this.externalMessageSender = null;
      this.linkedModule = null;

      this.context = {
        profile: options.profile || null,
        activeScheme: null,
        pageName: options.pageName || 'home',
        eligibilityResult: null
      };

      this.root         = null;
      this.panel        = null;
      this.triggerBtn   = null;
      this.messagesEl   = null;
      this.inputEl      = null;
      this.suggestionsEl = null;
      this.subtitleEl   = null;
      this.titleEl      = null;
      this.statusEl     = null;
      this.langBtnEl    = null;
      this.langDropdownEl = null;
      this.isOpen       = false;
      this._suggestionsHidden = false;

      this._buildDOM();
      this._bindEvents();
      this._updateUILanguage();
      this._appendWelcome();
    }

    // ----------------------------------------------------------
    //  CONTEXT API METHODS
    // ----------------------------------------------------------
    setProfile (profile) {
      this.context.profile = profile ? { ...profile } : null;
      this._updateHeaderSubtitle();
    }

    setSchemeContext (scheme) {
      this.context.activeScheme = scheme ? { ...scheme } : null;
    }

    setPageContext (pageName) {
      this.context.pageName = pageName || 'home';
    }

    setEligibilityContext (result) {
      this.context.eligibilityResult = result;
    }

    linkSchemeModule (moduleInstance) {
      if (moduleInstance) {
        this.linkedModule = moduleInstance;
        if (!this.context.profile && moduleInstance.profile) {
          this.setProfile(moduleInstance.profile);
        }
        if ((!this.dataset || this.dataset.length === 0) && moduleInstance.dataset) {
          this.dataset = moduleInstance.dataset;
        }
      }
    }

    registerMessageSender (callback) {
      if (typeof callback === 'function') {
        this.externalMessageSender = callback;
      }
    }

    _getActiveProfile () {
      if (this.linkedModule && this.linkedModule.profile) {
        return this.linkedModule.profile;
      }
      return this.context.profile || {};
    }

    _getDataset () {
      if (this.linkedModule && this.linkedModule.dataset) {
        return this.linkedModule.dataset;
      }
      return this.dataset || [];
    }

    // ----------------------------------------------------------
    //  DOM CONSTRUCTION
    // ----------------------------------------------------------
    _buildDOM () {
      const root = document.createElement('div');
      root.className = 'govcenter-chatbot-root';
      root.setAttribute('role', 'complementary');
      root.setAttribute('aria-label', 'OneConnect AI');
      root.innerHTML = this._template();
      document.body.appendChild(root);
      this.root = root;

      this.triggerBtn    = root.querySelector('.govcenter-chatbot-button');
      this.panel         = root.querySelector('.govcenter-chatbot-panel');
      this.messagesEl    = root.querySelector('.govcenter-chatbot-messages');
      this.inputEl       = root.querySelector('.govcenter-chatbot-input');
      this.suggestionsEl = root.querySelector('.govcenter-chatbot-suggestions');
      this.titleEl       = root.querySelector('#govcenterChatHeaderTitle');
      this.subtitleEl    = root.querySelector('#govcenterChatHeaderSubtitle');
      this.statusEl      = root.querySelector('#govcenterChatHeaderStatus');
      this.langBtnEl     = root.querySelector('#govcenterChatLangBtn');
      this.langDropdownEl = root.querySelector('#govcenterChatLangDropdown');
    }

    _template () {
      return `
        <!-- Floating trigger button -->
        <button
          type="button"
          class="govcenter-chatbot-button"
          aria-label="Open OneConnect AI Assistant"
          aria-expanded="false"
          aria-controls="govcenterChatPanel"
        >
          <svg class="gc-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <svg class="gc-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Chat panel -->
        <div
          class="govcenter-chatbot-panel"
          id="govcenterChatPanel"
          role="dialog"
          aria-modal="false"
          aria-label="OneConnect AI Assistant chat panel"
        >
          <!-- Header -->
          <div class="govcenter-chatbot-header">
            <div class="govcenter-chatbot-header-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div class="govcenter-chatbot-header-info">
              <div class="govcenter-chatbot-header-title" id="govcenterChatHeaderTitle">OneConnect AI</div>
              <div class="govcenter-chatbot-header-subtitle" id="govcenterChatHeaderSubtitle">Your Government Services Assistant</div>
              <div class="govcenter-chatbot-header-status">
                <span class="govcenter-chatbot-header-status-dot" aria-hidden="true"></span>
                <span id="govcenterChatHeaderStatus">Online</span>
              </div>
            </div>

            <!-- Language Dropdown Selector -->
            <div class="govcenter-chatbot-lang-wrapper">
              <button type="button" class="govcenter-chatbot-lang-btn" id="govcenterChatLangBtn" aria-label="Select language" aria-haspopup="listbox" aria-expanded="false">
                🌐 <span id="govcenterChatSelectedLang">English</span> ▾
              </button>
              <ul class="govcenter-chatbot-lang-dropdown" id="govcenterChatLangDropdown" role="listbox" aria-label="Languages">
                <li role="option" data-lang="en" class="gc-lang-opt">English</li>
                <li role="option" data-lang="ta" class="gc-lang-opt">தமிழ்</li>
                <li role="option" data-lang="hi" class="gc-lang-opt">हिन्दी</li>
                <li role="option" data-lang="te" class="gc-lang-opt">తెలుగు</li>
                <li role="option" data-lang="kn" class="gc-lang-opt">ಕನ್ನಡ</li>
                <li role="option" data-lang="ml" class="gc-lang-opt">മലയാളം</li>
              </ul>
            </div>

            <button
              type="button"
              class="govcenter-chatbot-close-btn"
              aria-label="Close OneConnect AI Assistant"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Messages -->
          <div class="govcenter-chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>

          <!-- Quick suggestions -->
          <div class="govcenter-chatbot-suggestions" aria-label="Quick questions"></div>

          <!-- Input area -->
          <div class="govcenter-chatbot-input-area">
            <input
              type="text"
              class="govcenter-chatbot-input"
              placeholder="Ask about government schemes..."
              aria-label="Type your question about government schemes"
              autocomplete="off"
              maxlength="300"
            />
            <button
              type="button"
              class="govcenter-chatbot-send-btn"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      `;
    }

    // ----------------------------------------------------------
    //  EVENT BINDING
    // ----------------------------------------------------------
    _bindEvents () {
      this.triggerBtn.addEventListener('click', () => this.toggle());

      const closeBtn = this.panel.querySelector('.govcenter-chatbot-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      const sendBtn = this.panel.querySelector('.govcenter-chatbot-send-btn');
      if (sendBtn) sendBtn.addEventListener('click', () => this._send());

      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this._send();
        }
      });

      this.suggestionsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.govcenter-chatbot-suggestion-btn');
        if (btn) {
          const q = btn.getAttribute('data-query');
          this.inputEl.value = q;
          this._send();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Toggle Language dropdown
      this.langBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = this.langBtnEl.getAttribute('aria-expanded') === 'true';
        this.langBtnEl.setAttribute('aria-expanded', !expanded);
        this.langDropdownEl.classList.toggle('gc-show');
      });

      // Close Language dropdown on outside click
      document.addEventListener('click', () => {
        this.langBtnEl.setAttribute('aria-expanded', 'false');
        this.langDropdownEl.classList.remove('gc-show');
      });

      // Click Language Option
      this.langDropdownEl.addEventListener('click', (e) => {
        const opt = e.target.closest('.gc-lang-opt');
        if (opt) {
          const newLang = opt.getAttribute('data-lang');
          this.changeLanguage(newLang);
        }
      });
    }

    // ----------------------------------------------------------
    //  LANGUAGE CONTROLLERS
    // ----------------------------------------------------------
    changeLanguage (langCode) {
      if (!TRANSLATIONS[langCode]) return;
      this.currentLanguage = langCode;
      localStorage.setItem('oneconnect_chat_language', langCode);

      this._updateUILanguage();
      this._updateHeaderSubtitle();

      // Clear the message history and show welcome in new language
      this.messagesEl.innerHTML = '';
      this._appendWelcome();
    }

    _updateUILanguage () {
      const t = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;

      // Update header labels
      this.titleEl.textContent = t.title;
      this.statusEl.textContent = t.statusOnline;

      // Update input placeholder and label
      this.inputEl.placeholder = t.placeholder;
      this.inputEl.setAttribute('aria-label', t.placeholder);

      // Update language selection button display
      const selectedLangEl = this.root.querySelector('#govcenterChatSelectedLang');
      if (selectedLangEl) selectedLangEl.textContent = t.langName;

      // Update active option in dropdown
      const opts = this.langDropdownEl.querySelectorAll('.gc-lang-opt');
      opts.forEach(opt => {
        if (opt.getAttribute('data-lang') === this.currentLanguage) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });

      // Update close and send btn ARIA labels
      const closeBtn = this.panel.querySelector('.govcenter-chatbot-close-btn');
      if (closeBtn) closeBtn.setAttribute('aria-label', t.closeBtn);
      const sendBtn = this.panel.querySelector('.govcenter-chatbot-send-btn');
      if (sendBtn) sendBtn.setAttribute('aria-label', t.sendBtn);

      // Re-populate suggestions
      this._updateSuggestions();
    }

    _updateSuggestions () {
      if (!this.suggestionsEl) return;
      const t = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;

      const suggestionsData = [
        { label: t.chipEligible,   query: t.queryEligible },
        { label: t.chipScholarship, query: t.queryScholarship },
        { label: t.chipWomen,       query: t.queryWomen },
        { label: t.chipFinancial,   query: t.queryFinancial },
        { label: t.chipFarmer,      query: t.queryFarmer }
      ];

      this.suggestionsEl.innerHTML = suggestionsData.map(s =>
        `<button type="button" class="govcenter-chatbot-suggestion-btn" data-query="${this._escapeAttr(s.query)}" aria-label="${this._escapeAttr(s.label)}">${this._escapeHtml(s.label)}</button>`
      ).join('');
    }

    // ----------------------------------------------------------
    //  OPEN / CLOSE / TOGGLE
    // ----------------------------------------------------------
    open () {
      this.isOpen = true;
      this.panel.classList.add('gc-open');
      this.triggerBtn.classList.add('gc-open');
      this.triggerBtn.setAttribute('aria-expanded', 'true');
      this._updateHeaderSubtitle();
      setTimeout(() => this.inputEl.focus(), 230);
    }

    close () {
      this.isOpen = false;
      this.panel.classList.remove('gc-open');
      this.triggerBtn.classList.remove('gc-open');
      this.triggerBtn.setAttribute('aria-expanded', 'false');
      this.triggerBtn.focus();
    }

    toggle () {
      this.isOpen ? this.close() : this.open();
    }

    // ----------------------------------------------------------
    //  DYNAMIC HEADER SUBTITLE UPDATE
    // ----------------------------------------------------------
    _updateHeaderSubtitle () {
      if (!this.subtitleEl) return;
      const p = this._getActiveProfile();
      const t = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
      const parts = [];

      if (p.occupation) parts.push(p.occupation);
      if (p.state)      parts.push(p.state);
      if (p.age)        parts.push(`${t.profileAge} ${p.age}`);

      this.subtitleEl.textContent = parts.length > 0
        ? parts.join(' · ')
        : t.subtitle;
    }

    // ----------------------------------------------------------
    //  WELCOME MESSAGE
    // ----------------------------------------------------------
    _appendWelcome () {
      const p = this._getActiveProfile();
      const t = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;

      const profileParts = [];
      if (p.occupation) profileParts.push(p.occupation);
      if (p.state)      profileParts.push(p.state);
      if (p.age)        profileParts.push(`${t.profileAge.toLowerCase()} ${p.age}`);

      let msgText = '';
      if (profileParts.length > 0) {
        msgText = t.welcomeProfile.replace('{profile}', profileParts.join(', '));
      } else {
        msgText = t.welcome;
      }

      this._addBotMessage(msgText, [], false, null);
    }

    // ----------------------------------------------------------
    //  MESSAGE SENDING & AI HOOK
    // ----------------------------------------------------------
    async _send () {
      const query = this.inputEl.value.trim();
      if (!query) return;
      this.inputEl.value = '';

      if (!this._suggestionsHidden && this.suggestionsEl) {
        this.suggestionsEl.style.display = 'none';
        this._suggestionsHidden = true;
      }

      this._addUserMessage(query);
      const typingEl = this._addTyping();

      const context = {
        profile:        { ...this._getActiveProfile() },
        activeFilters:  this.linkedModule ? { ...this.linkedModule.state } : {},
        visibleSchemes: this.linkedModule ? this.linkedModule.getFilteredResults() : [],
        allSchemes:     this._getDataset()
      };

      try {
        let response;
        if (typeof this.externalMessageSender === 'function') {
          const text = await this.externalMessageSender(query, context);
          response = { text: String(text), schemes: [], showEligibleBtn: false };
        } else {
          response = await this._resolveHeuristic(query, context);
        }

        typingEl.remove();

        this._addBotMessage(
          response.text,
          response.schemes || [],
          response.showEligibleBtn || false,
          response.schemeForActions || null
        );

      } catch (err) {
        console.error('[OneConnect AI] Error:', err);
        typingEl.remove();
        this._addBotMessage("Sorry, I encountered an error. Please try again.", [], false, null);
      }
    }

    // ----------------------------------------------------------
    //  FILTER MUTATIONS
    // ----------------------------------------------------------
    _applyFilter (field, value) {
      if (this.linkedModule) {
        const update = {};
        if (field === 'categories')       update.categories       = value ? [value] : [];
        if (field === 'locations')        update.locations        = value ? [value] : [];
        if (field === 'eligibilityStatus') update.eligibilityStatus = value;
        if (field === 'beneficiaryTypes') update.beneficiaryTypes = value ? [value] : [];
        update.currentPage = 1;
        this.linkedModule.setFilters(update);
      }
    }

    // ----------------------------------------------------------
    //  HEURISTIC RESOLVER (FALLBACK ENGINE)
    // ----------------------------------------------------------
    async _resolveHeuristic (query, context) {
      // Simulate delay
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200));

      const q       = query.toLowerCase().trim();
      const p       = context.profile || {};
      const dataset = context.allSchemes || [];
      const activeScheme = this.context.activeScheme;
      const lang    = this.currentLanguage;
      const t       = TRANSLATIONS[lang] || TRANSLATIONS.en;

      const dedup = (arr) => [...new Map(arr.map(s => [s.id, s])).values()];

      const kwSearch = (keyword) => dataset.filter(s =>
        (s.name        || '').toLowerCase().includes(keyword) ||
        (s.details     || '').toLowerCase().includes(keyword) ||
        (s.benefits    || '').toLowerCase().includes(keyword) ||
        (s.eligibility || '').toLowerCase().includes(keyword) ||
        (s.category    || '').toLowerCase().includes(keyword) ||
        (s.tags        || []).some(t => t.toLowerCase().includes(keyword))
      );

      const profileSummary = () => {
        const parts = [];
        if (p.age)        parts.push(`${t.profileAge}: ${p.age}`);
        if (p.state)      parts.push(`${t.profileState}: ${p.state}`);
        if (p.occupation) parts.push(`${t.profileOccupation}: ${p.occupation}`);
        if (p.income)     parts.push(`${t.profileIncome}: ₹${parseInt(p.income, 10).toLocaleString()}`);
        return parts.length > 0 ? parts.join(', ') : 'incomplete profile';
      };

      const checkElig = (scheme) => {
        if (this.linkedModule) {
          return this.linkedModule.evaluateEligibility(scheme);
        }
        return { status: 'ELIGIBLE', reason: 'Basic details match general eligibility rules.' };
      };

      // Helper to check if string contains any term in arrays across active lang or English
      const matchesIntent = (key) => {
        const terms = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || [];
        const enTerms = TRANSLATIONS.en[key] || [];
        return terms.some(term => q.includes(term.toLowerCase())) ||
               enTerms.some(term => q.includes(term.toLowerCase()));
      };

      // --------------------------------------------------------
      //  1. GREETINGS
      // --------------------------------------------------------
      if (matchesIntent('greetings')) {
        return {
          text: t.greetingResponse,
          schemes: [],
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  2. THANK YOU
      // --------------------------------------------------------
      if (matchesIntent('thanks')) {
        return {
          text: t.thanksResponse,
          schemes: [],
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  3. GOODBYE
      // --------------------------------------------------------
      if (matchesIntent('goodbye')) {
        return {
          text: t.goodbyeResponse,
          schemes: [],
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  4. CASUAL CONVERSATION / CAPABILITIES
      // --------------------------------------------------------
      if (matchesIntent('casuals')) {
        return {
          text: t.casualResponse,
          schemes: [],
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  5. ELIGIBILITY QUESTIONS
      // --------------------------------------------------------
      if (matchesIntent('eligibility')) {
        const eligible = dataset.filter(s => checkElig(s).status === 'ELIGIBLE');

        if (eligible.length === 0) {
          return {
            text: t.noEligible.replace('{profile}', profileSummary()),
            schemes: [],
            showEligibleBtn: false
          };
        }

        this._applyFilter('eligibilityStatus', 'ELIGIBLE');

        const filteredNotify = this.linkedModule ? t.filteredText : "";

        return {
          text: t.foundEligible
            .replace('{profile}', profileSummary())
            .replace('{count}', eligible.length)
            .replace('{filtered}', filteredNotify),
          schemes: eligible.slice(0, 4),
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  6. ACTIVE SCHEME CONTEXT QUESTIONS
      // --------------------------------------------------------
      const isBenefitsQuery = matchesIntent('benefits');
      const isWhoCanApply   = matchesIntent('eligibilityCriteria');
      const isWhatIsThis    = matchesIntent('about');
      const isDocumentQuery = matchesIntent('documents');
      const isApplyQuery    = matchesIntent('apply');

      if (activeScheme) {
        if (isBenefitsQuery) {
          const body = activeScheme.benefits && activeScheme.benefits.trim()
            ? `**${t.benefitsFor} ${activeScheme.name}:**\n\n${t.datasetDisclaimer}\n\n${activeScheme.benefits.trim()}`
            : t.noBenefitInfo.replace('{name}', activeScheme.name);
          return {
            text: body,
            schemes: [],
            showEligibleBtn: false,
            schemeForActions: activeScheme
          };
        }
        if (isWhoCanApply) {
          const body = activeScheme.eligibility && activeScheme.eligibility.trim()
            ? `**${t.eligibilityFor} ${activeScheme.name}:**\n\n${t.datasetDisclaimer}\n\n${activeScheme.eligibility.trim()}`
            : t.noEligibilityInfo.replace('{name}', activeScheme.name);
          return {
            text: body,
            schemes: [],
            showEligibleBtn: false,
            schemeForActions: activeScheme
          };
        }
        if (isWhatIsThis) {
          const body = activeScheme.details && activeScheme.details.trim()
            ? `**${t.aboutScheme} ${activeScheme.name}:**\n\n${t.datasetDisclaimer}\n\n${activeScheme.details.trim()}`
            : t.noDescInfo.replace('{name}', activeScheme.name);
          return {
            text: body,
            schemes: [],
            showEligibleBtn: false,
            schemeForActions: activeScheme
          };
        }
        if (isDocumentQuery) {
          const body = activeScheme.documents && activeScheme.documents.trim()
            ? `**${t.documentsFor} ${activeScheme.name}:**\n\n${t.datasetDisclaimer}\n\n${activeScheme.documents.trim()}`
            : t.noDocInfo.replace('{name}', activeScheme.name);
          return {
            text: body,
            schemes: [],
            showEligibleBtn: false,
            schemeForActions: activeScheme
          };
        }
        if (isApplyQuery) {
          const body = activeScheme.application && activeScheme.application.trim()
            ? `**${t.applyFor} ${activeScheme.name}:**\n\n${t.datasetDisclaimer}\n\n${activeScheme.application.trim()}`
            : t.noApplyInfo.replace('{name}', activeScheme.name);
          return {
            text: body,
            schemes: [],
            showEligibleBtn: false,
            schemeForActions: activeScheme
          };
        }
      }

      // --------------------------------------------------------
      //  7. DOCUMENT QUESTIONS (generic, no active scheme)
      // --------------------------------------------------------
      if (isDocumentQuery) {
        return {
          text: t.noActiveSchemeDoc,
          schemes: [],
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  8. APPLICATION QUESTIONS (generic, no active scheme)
      // --------------------------------------------------------
      if (isApplyQuery) {
        return {
          text: t.noActiveSchemeApply,
          schemes: [],
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  9. GOVERNMENT JOB QUESTIONS
      // --------------------------------------------------------
      if (matchesIntent('jobs')) {
        return {
          text: t.jobsResponse,
          schemes: [],
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  10. PROFILE QUESTIONS
      // --------------------------------------------------------
      if (matchesIntent('profile')) {
        const header = getLocalizedProfileHeader(p, lang);
        return {
          text: header,
          schemes: [],
          showEligibleBtn: false
        };
      }

      // --------------------------------------------------------
      //  11. SCHEME SEARCH & LOOKUP (using mappings)
      // --------------------------------------------------------
      const DETECTABLE_STATES = [
        'tamil nadu','puducherry','karnataka','maharashtra','delhi',
        'uttar pradesh','kerala','gujarat','andhra pradesh','rajasthan',
        'west bengal','bihar','punjab','haryana','madhya pradesh','telangana',
        'odisha','jharkhand','assam','chhattisgarh','himachal','uttarakhand',
        'jammu','kashmir','manipur','meghalaya','mizoram','nagaland','sikkim','tripura'
      ];

      // Map localized input categories/states to search keys
      let searchKey = '';
      let catFilter = null;
      let locFilter = null;
      let benefFilter = null;

      // Detect Search Intent by checking words from the search trigger list or states list
      let isSearchQuery = matchesIntent('search') ||
                          DETECTABLE_STATES.some(st => q.includes(st)) ||
                          (q.length >= 6 && dataset.some(s => (s.name || '').toLowerCase().includes(q)));

      // Extra check: if query has a localized equivalent match
      const checkLocals = () => {
        // Tamil Matchers
        if (lang === 'ta') {
          if (q.includes('உதவித்தொகை') || q.includes('மாணவர்') || q.includes('கல்வி') || q.includes('படிப்பு')) {
            catFilter = 'Education'; searchKey = 'education'; return true;
          }
          if (q.includes('பெண்') || q.includes('மகளிர்')) {
            benefFilter = 'women'; searchKey = 'women'; return true;
          }
          if (q.includes('விவசாய') || q.includes('கிசான்') || q.includes('பயிர்')) {
            catFilter = 'Agriculture'; searchKey = 'farmer'; return true;
          }
          if (q.includes('நிதி') || q.includes('பணம்') || q.includes('உதவி') || q.includes('ஓய்வூதியம்')) {
            searchKey = 'financial assistance'; return true;
          }
          if (q.includes('மாற்றுத்திறனாளி') || q.includes('ஊனம்')) {
            benefFilter = 'disability'; searchKey = 'disability'; return true;
          }
          if (q.includes('முதியவர்') || q.includes('வயதானவர்') || q.includes('ஓய்வு பெற்ற')) {
            benefFilter = 'senior'; searchKey = 'senior'; return true;
          }
          if (q.includes('தொழில்') || q.includes('வியாபாரம்') || q.includes('வணிகம்')) {
            catFilter = 'Business'; searchKey = 'business'; return true;
          }
          if (q.includes('வீடு') || q.includes('ஆவாஸ்')) {
            catFilter = 'Housing'; searchKey = 'housing'; return true;
          }
          if (q.includes('தமிழ் நாடு') || q.includes('தமிழ்நாடு')) {
            locFilter = 'Tamil Nadu'; return true;
          }
          if (q.includes('புதுச்சேரி')) {
            locFilter = 'Puducherry'; return true;
          }
        }
        // Hindi Matchers
        if (lang === 'hi') {
          if (q.includes('छात्र') || q.includes('शिक्षा') || q.includes('स्कूल') || q.includes('कॉलेज') || q.includes('छात्रवृत्ति')) {
            catFilter = 'Education'; searchKey = 'education'; return true;
          }
          if (q.includes('महिला') || q.includes('लड़की') || q.includes('स्त्री')) {
            benefFilter = 'women'; searchKey = 'women'; return true;
          }
          if (q.includes('किसान') || q.includes('कृषि') || q.includes('फसल') || q.includes('खेती')) {
            catFilter = 'Agriculture'; searchKey = 'farmer'; return true;
          }
          if (q.includes('सहायता') || q.includes('पैसे') || q.includes('पेंशन') || q.includes('राहत')) {
            searchKey = 'financial assistance'; return true;
          }
          if (q.includes('विकलांग') || q.includes('दिव्यांग')) {
            benefFilter = 'disability'; searchKey = 'disability'; return true;
          }
          if (q.includes('वरिष्ठ') || q.includes('बुजुर्ग')) {
            benefFilter = 'senior'; searchKey = 'senior'; return true;
          }
          if (q.includes('व्यापार') || q.includes('उद्योग') || q.includes('उद्यमी')) {
            catFilter = 'Business'; searchKey = 'business'; return true;
          }
          if (q.includes('आवास') || q.includes('घर') || q.includes('लोन')) {
            catFilter = 'Housing'; searchKey = 'housing'; return true;
          }
          if (q.includes('तमिलनाडु')) { locFilter = 'Tamil Nadu'; return true; }
          if (q.includes('पुडुचेरी') || q.includes('पांडिचेरी')) { locFilter = 'Puducherry'; return true; }
        }
        // Telugu Matchers
        if (lang === 'te') {
          if (q.includes('విద్యార్థి') || q.includes('విద్య') || q.includes('పాఠశాల') || q.includes('స్కాలర్‌షిప్')) {
            catFilter = 'Education'; searchKey = 'education'; return true;
          }
          if (q.includes('महिला') || q.includes('స్త్రీ') || q.includes('అమ్మాయి')) {
            benefFilter = 'women'; searchKey = 'women'; return true;
          }
          if (q.includes('రైతు') || q.includes('వ్యవసాయం') || q.includes('పంట')) {
            catFilter = 'Agriculture'; searchKey = 'farmer'; return true;
          }
          if (q.includes('సహాయం') || q.includes('డబ్బు') || q.includes('పెన్షన్')) {
            searchKey = 'financial assistance'; return true;
          }
          if (q.includes('వికలాంగులు') || q.includes('దివ్యాంగులు')) {
            benefFilter = 'disability'; searchKey = 'disability'; return true;
          }
          if (q.includes('వృద్ధులు') || q.includes('పెన్షన్')) {
            benefFilter = 'senior'; searchKey = 'senior'; return true;
          }
          if (q.includes('వ్యాపారం') || q.includes('పరిశ్రమ') || q.includes('స్టార్టಪ್')) {
            catFilter = 'Business'; searchKey = 'business'; return true;
          }
          if (q.includes('ఇల్లు') || q.includes('ఆవాస్')) {
            catFilter = 'Housing'; searchKey = 'housing'; return true;
          }
        }
        // Kannada Matchers
        if (lang === 'kn') {
          if (q.includes('ವಿದ್ಯಾರ್ಥಿ') || q.includes('ಶಿಕ್ಷಣ') || q.includes('ವಿದ್ಯಾರ್ಥಿವೇತನ')) {
            catFilter = 'Education'; searchKey = 'education'; return true;
          }
          if (q.includes('ಮಹಿಳೆ') || q.includes('ಹುಡುಗಿ')) {
            benefFilter = 'women'; searchKey = 'women'; return true;
          }
          if (q.includes('ರೈತ') || q.includes('ಕೃಷಿ') || q.includes('ಬೆಳೆ')) {
            catFilter = 'Agriculture'; searchKey = 'farmer'; return true;
          }
          if (q.includes('ಹಣ') || q.includes('ಪಿಂಚಣಿ') || q.includes('ನೆರವು')) {
            searchKey = 'financial assistance'; return true;
          }
          if (q.includes('ವಿಕಲಚೇತನರು')) {
            benefFilter = 'disability'; searchKey = 'disability'; return true;
          }
          if (q.includes('ಹಿರಿಯ')) {
            benefFilter = 'senior'; searchKey = 'senior'; return true;
          }
          if (q.includes('ವ್ಯವಹಾರ') || q.includes('ಉದ್ಯಮ')) {
            catFilter = 'Business'; searchKey = 'business'; return true;
          }
          if (q.includes('ಮನೆ') || q.includes('ವಸತಿ')) {
            catFilter = 'Housing'; searchKey = 'housing'; return true;
          }
        }
        // Malayalam Matchers
        if (lang === 'ml') {
          if (q.includes('വിദ്യാർത്ഥി') || q.includes('സ്കോളർഷിപ്പ്') || q.includes('വിദ്യാഭ്യാസം')) {
            catFilter = 'Education'; searchKey = 'education'; return true;
          }
          if (q.includes('സ്ത്രീ') || q.includes('പെൺകുട്ടി')) {
            benefFilter = 'women'; searchKey = 'women'; return true;
          }
          if (q.includes('കർഷക') || q.includes('കൃഷി')) {
            catFilter = 'Agriculture'; searchKey = 'farmer'; return true;
          }
          if (q.includes('ധനസഹായം') || q.includes('പണം') || q.includes('പെൻഷൻ')) {
            searchKey = 'financial assistance'; return true;
          }
          if (q.includes('ഭിന്നശേഷി')) {
            benefFilter = 'disability'; searchKey = 'disability'; return true;
          }
          if (q.includes('മുതിർന്ന')) {
            benefFilter = 'senior'; searchKey = 'senior'; return true;
          }
          if (q.includes('ബിസിനസ്സ്') || q.includes('വ്യവസായം')) {
            catFilter = 'Business'; searchKey = 'business'; return true;
          }
          if (q.includes('ഭവനം') || q.includes('വീട്')) {
            catFilter = 'Housing'; searchKey = 'housing'; return true;
          }
        }
        return false;
      };

      const matchedLocal = checkLocals();
      if (matchedLocal) {
        isSearchQuery = true;
      }

      if (isSearchQuery) {
        // Handle categories and states updates if mapped
        if (catFilter)       this._applyFilter('categories', catFilter);
        if (locFilter)       this._applyFilter('locations', locFilter);
        if (benefFilter)     this._applyFilter('beneficiaryTypes', benefFilter);

        const finalSearchKey = searchKey || q;

        // Details summary lookup (e.g. "tell me about Garuda")
        const detailPhrases = ['tell me about', 'details of', 'more about', 'what is', 'describe', 'explain', 'info on', 'information on', 'show me'];
        let isDetailLookup = detailPhrases.some(ph => q.includes(ph));

        // If localized details phrases were used
        if (lang === 'ta' && q.includes('பற்றி')) isDetailLookup = true;
        if (lang === 'hi' && q.includes('के बारे में')) isDetailLookup = true;

        if (isDetailLookup) {
          let stripped = q;
          detailPhrases.forEach(ph => { stripped = stripped.replace(new RegExp(ph, 'i'), '').trim(); });
          stripped = stripped.replace(/^(the|a|an|scheme|yojana|plan)\s+/i, '').trim();
          // Remove localized filler words
          stripped = stripped.replace(/பற்றி/g, '').replace(/के बारे में/g, '').trim();

          if (stripped.length > 2) {
            const match = dataset.find(s => (s.name || '').toLowerCase().includes(stripped)) ||
                          dataset.find(s => (s.slug || '').toLowerCase().includes(stripped));
            if (match) {
              return {
                text: this._buildSchemeSummaryText(match),
                schemes: [],
                showEligibleBtn: false,
                schemeForActions: match
              };
            }
          }
        }

        // Direct Scheme Name Detection
        if (q.length >= 6) {
          const qWords = q.split(/\s+/).filter(w => w.length > 3);
          if (qWords.length > 0) {
            let bestMatch = null;
            let bestScore = 0;
            for (const s of dataset) {
              const nameWords = (s.name || '').toLowerCase().split(/[\s\-\/]+/).filter(w => w.length > 3);
              if (nameWords.length === 0) continue;
              const hits = qWords.filter(w => nameWords.some(nw => nw.startsWith(w) || w.startsWith(nw))).length;
              const score = hits / Math.max(qWords.length, nameWords.length);
              if (score > bestScore) { bestScore = score; bestMatch = s; }
            }
            if (bestMatch && bestScore >= 0.5) {
              return {
                text: this._buildSchemeSummaryText(bestMatch),
                schemes: [],
                showEligibleBtn: false,
                schemeForActions: bestMatch
              };
            }
          }
        }

        // Search the dataset using the derived searchKey
        const results = kwSearch(finalSearchKey);
        if (results.length > 0) {
          return {
            text: t.searchTitle.replace('{count}', results.length).replace('{query}', query),
            schemes: results.slice(0, 4),
            showEligibleBtn: true
          };
        }
      }

      // --------------------------------------------------------
      //  12. FALLBACK
      // --------------------------------------------------------
      return {
        text: t.fallbackResponse,
        schemes: [],
        showEligibleBtn: false
      };
    }

    // ----------------------------------------------------------
    //  SUMMARY STRING GENERATION
    // ----------------------------------------------------------
    _buildSchemeSummaryText (scheme) {
      const name        = scheme.name        || 'This scheme';
      const category    = scheme.category    ? scheme.category.split(',')[0].trim() : null;
      const level       = scheme.level       || null;
      const details     = scheme.details     || null;
      const benefits    = scheme.benefits    || null;
      const eligibility = scheme.eligibility || null;
      const documents   = scheme.documents   || null;
      const t           = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;

      let text = `**${name}**`;
      if (level) {
        const levelLabel = level === 'Central' ? t.schemeLevelCentral : level;
        text += ` — ${levelLabel}`;
      }
      text += '.\n\n';

      text += `${t.datasetDisclaimer}\n\n`;

      if (details) {
        const shortDetails = details.replace(/\s+/g, ' ').trim();
        const sentenceMatch = shortDetails.match(/^(.*?[.!?]\s+.*?[.!?])/s);
        const excerpt = sentenceMatch ? sentenceMatch[1].substring(0, 320) : shortDetails.substring(0, 300);
        text += excerpt.trim();
        if (excerpt.length < shortDetails.length) text += '…';
        text += '\n\n';
      }

      text += `**${t.aboutScheme}:**\n`;
      text += `• ${t.profileState}: ${level ? (level === 'Central' ? t.schemeLevelCentral : level) : '—'}\n`;

      if (benefits) {
        const shortBenefit = benefits.replace(/\s+/g, ' ').trim().substring(0, 200);
        text += `• ${t.benefitsFor}: ${shortBenefit}${benefits.length > 200 ? '…' : ''}\n`;
      }

      if (eligibility) {
        const shortElig = eligibility.replace(/\s+/g, ' ').trim().substring(0, 200);
        text += `• ${t.eligibilityFor}: ${shortElig}${eligibility.length > 200 ? '…' : ''}\n`;
      }

      if (documents) {
        const shortDocs = documents.replace(/\s+/g, ' ').trim().substring(0, 180);
        text += `• ${t.documentsFor}: ${shortDocs}${documents.length > 180 ? '…' : ''}\n`;
      }

      return text;
    }

    // ----------------------------------------------------------
    //  RENDER USER MESSAGE
    // ----------------------------------------------------------
    _addUserMessage (text) {
      const msg = document.createElement('div');
      msg.className = 'govcenter-chatbot-message gc-msg-user';
      msg.innerHTML = `<div class="govcenter-chatbot-bubble">${this._escapeHtml(text)}</div>`;
      this.messagesEl.appendChild(msg);
      this._scrollBottom();
    }

    // ----------------------------------------------------------
    //  RENDER BOT MESSAGE (WITH LOCALIZED ACTION BUTTONS & MINI CARDS)
    // ----------------------------------------------------------
    _addBotMessage (text, schemes = [], showEligibleBtn = false, schemeForActions = null) {
      const t = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
      const wrapper = document.createElement('div');
      wrapper.className = 'govcenter-chatbot-message gc-msg-bot';

      const bubble = document.createElement('div');
      bubble.className = 'govcenter-chatbot-bubble';
      bubble.innerHTML = this._renderText(text);
      wrapper.appendChild(bubble);

      // Renders per-scheme action buttons (localized)
      if (schemeForActions) {
        const actionsRow = document.createElement('div');
        actionsRow.className = 'govcenter-chatbot-scheme-actions';

        const actionDefs = [
          { label: t.btnEligible,  action: 'eligible'  },
          { label: t.btnDocuments, action: 'documents' },
          { label: t.btnApply,     action: 'apply'     }
        ];

        actionDefs.forEach(def => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'govcenter-chatbot-action-btn-scheme';
          btn.textContent = def.label;
          btn.addEventListener('click', () => {
            this._handleSchemeAction(def.action, schemeForActions);
          });
          actionsRow.appendChild(btn);
        });

        wrapper.appendChild(actionsRow);

        // View Full Details link (localized)
        const viewBtn = document.createElement('button');
        viewBtn.type = 'button';
        viewBtn.className = 'gc-scheme-view-btn';
        viewBtn.setAttribute('aria-label', `Open details for ${this._escapeAttr(schemeForActions.name)}`);
        viewBtn.textContent = t.viewFullDetails;
        viewBtn.addEventListener('click', () => {
          if (this.onSchemeSelect) {
            this.onSchemeSelect(schemeForActions);
          }
          if (this.linkedModule && this.linkedModule.resultsComponent && typeof this.linkedModule.resultsComponent.openDetailsModal === 'function') {
            this.linkedModule.resultsComponent.openDetailsModal(schemeForActions);
          }
        });
        wrapper.appendChild(viewBtn);
      }

      // Renders global filter button (localized)
      if (showEligibleBtn) {
        const actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.className = 'govcenter-chatbot-action-btn-global';
        actionBtn.textContent = t.btnShowEligibleGlobal;
        actionBtn.addEventListener('click', () => {
          this._applyFilter('eligibilityStatus', 'ELIGIBLE');
          actionBtn.textContent = t.filterAppliedGlobal;
          actionBtn.disabled = true;
        });
        wrapper.appendChild(actionBtn);
      }

      // Renders mini-cards
      schemes.forEach(scheme => {
        const card = this._buildSchemeCard(scheme);
        wrapper.appendChild(card);
      });

      this.messagesEl.appendChild(wrapper);
      this._scrollBottom();
    }

    // ----------------------------------------------------------
    //  SCHEME QUICK-ACTION HANDLER (LOCALIZED)
    // ----------------------------------------------------------
    _handleSchemeAction (action, scheme) {
      const t = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
      const labels = { eligible: t.btnEligible, documents: t.btnDocuments, apply: t.btnApply };
      this._addUserMessage(labels[action] || action);
      const typingEl = this._addTyping();

      setTimeout(() => {
        typingEl.remove();
        let responseText = '';

        if (action === 'eligible') {
          const evalResult = checkEligText(scheme, this.linkedModule);
          const p = this._getActiveProfile();
          const profileParts = [];
          if (p.age)        profileParts.push(`${t.profileAge} ${p.age}`);
          if (p.state)      profileParts.push(p.state);
          if (p.occupation) profileParts.push(p.occupation);
          if (p.income)     profileParts.push(`₹${parseInt(p.income, 10).toLocaleString()}`);
          const profileStr = profileParts.length > 0 ? profileParts.join(', ') : 'your profile';

          if (evalResult.status === 'ELIGIBLE') {
            responseText = t.evalEligibleReason
              .replace('{profile}', profileStr)
              .replace('{name}', scheme.name)
              .replace('{reason}', evalResult.reason);
          } else if (evalResult.status === 'NOT_ELIGIBLE') {
            responseText = t.evalNotEligibleReason
              .replace('{profile}', profileStr)
              .replace('{name}', scheme.name)
              .replace('{reason}', evalResult.reason);
          } else {
            responseText = t.evalInfoNeededReason
              .replace('{profile}', profileStr)
              .replace('{name}', scheme.name)
              .replace('{reason}', evalResult.reason);
          }

        } else if (action === 'documents') {
          if (scheme.documents && scheme.documents.trim()) {
            responseText = `**${t.documentsFor} ${scheme.name}:**\n\n${t.datasetDisclaimer}\n\n${scheme.documents.trim()}`;
          } else {
            responseText = t.noDocInfo.replace('{name}', scheme.name);
          }

        } else if (action === 'apply') {
          if (scheme.application && scheme.application.trim()) {
            responseText = `**${t.applyFor} ${scheme.name}:**\n\n${t.datasetDisclaimer}\n\n${scheme.application.trim()}`;
          } else {
            responseText = t.noApplyInfo.replace('{name}', scheme.name);
          }
        }

        this._addBotMessage(responseText, [], false, null);
      }, 400);

      function checkEligText(sch, mod) {
        if (mod) {
          return mod.evaluateEligibility(sch);
        }
        return { status: 'ELIGIBLE', reason: 'Basic details match general eligibility rules.' };
      }
    }

    // ----------------------------------------------------------
    //  RENDER SCHEME MINI CARD (LOCALIZED)
    // ----------------------------------------------------------
    _buildSchemeCard (scheme) {
      const t = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
      const evalResult  = this.linkedModule ? this.linkedModule.evaluateEligibility(scheme) : { status: 'ELIGIBLE' };
      const mainCat     = (scheme.category || 'General Welfare').split(',')[0].trim();
      
      const levelLabel  = scheme.level === 'Central' ? t.schemeLevelCentral : t.schemeLevelState;
      const benefitText = scheme.benefits
        ? scheme.benefits.substring(0, 100) + (scheme.benefits.length > 100 ? '…' : '')
        : null;

      const isEligible  = evalResult.status === 'ELIGIBLE';

      const card = document.createElement('div');
      card.className = 'gc-scheme-card';
      card.innerHTML = `
        <div class="gc-scheme-card-name">${this._escapeHtml(scheme.name)}</div>
        <div class="gc-scheme-card-meta">
          <span class="gc-scheme-tag">${this._escapeHtml(mainCat)}</span>
          <span class="gc-scheme-tag gc-tag-level">${this._escapeHtml(levelLabel)}</span>
          ${isEligible ? `<span class="gc-scheme-tag gc-tag-eligible">🟢 ${t.eligibleTag}</span>` : ''}
        </div>
        ${benefitText ? `<div class="gc-scheme-card-benefit">${this._escapeHtml(benefitText)}</div>` : ''}
        <button type="button" class="gc-scheme-view-btn" aria-label="View details for ${this._escapeAttr(scheme.name)}">${t.viewDetails}</button>
      `;

      card.querySelector('.gc-scheme-view-btn').addEventListener('click', () => {
        if (this.onSchemeSelect) {
          this.onSchemeSelect(scheme);
        }
        if (this.linkedModule && this.linkedModule.resultsComponent && typeof this.linkedModule.resultsComponent.openDetailsModal === 'function') {
          this.linkedModule.resultsComponent.openDetailsModal(scheme);
        }
      });

      return card;
    }

    _addTyping () {
      const el = document.createElement('div');
      el.className = 'govcenter-chatbot-message gc-msg-bot';
      el.innerHTML = `
        <div class="govcenter-chatbot-typing" aria-label="Thinking" role="status">
          <span class="govcenter-chatbot-typing-dot"></span>
          <span class="govcenter-chatbot-typing-dot"></span>
          <span class="govcenter-chatbot-typing-dot"></span>
        </div>
      `;
      this.messagesEl.appendChild(el);
      this._scrollBottom();
      return el;
    }

    _scrollBottom () {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }

    _escapeHtml (str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    _escapeAttr (str) {
      return String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    _renderText (text) {
      return this._escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }
  }

  // Profile context formatting helper
  const getLocalizedProfileHeader = (p, langCode) => {
    const t = TRANSLATIONS[langCode] || TRANSLATIONS.en;
    const yesNo = p.disability ? t.profileYes : t.profileNo;
    const incomeStr = p.income !== undefined ? '₹' + parseInt(p.income, 10).toLocaleString() : '';

    return `${t.profileHeader}\n\n` +
           `• **${t.profileAge}**: ${p.age || '—'}\n` +
           `• **${t.profileState}**: ${p.state || '—'}\n` +
           `• **${t.profileGender}**: ${p.gender || '—'}\n` +
           `• **${t.profileOccupation}**: ${p.occupation || '—'}\n` +
           `• **${t.profileIncome}**: ${incomeStr}\n` +
           `• **${t.profilePwD}**: ${yesNo}`;
  };

  // Global Initialization
  window.initGovCenterChatbot = function (options) {
    if (window.oneConnectChatbot) {
      return window.oneConnectChatbot;
    }
    const chatbot = new GovCenterChatbot(options);
    window.oneConnectChatbot = chatbot;
    return chatbot;
  };

})(window);
