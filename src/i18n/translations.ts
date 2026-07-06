/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Full EN / FR translation strings for NashGlam Lashes.
 */

export type Lang = 'en' | 'fr';

export const translations = {
  en: {
    // ── HEADER ──────────────────────────────────────────────────────────────
    header: {
      brand: 'NASHGLAM',
      brandAccent: 'LASHES',
      navWelcome: 'WELCOME',
      navShop: 'LASH CARE SHOP',
      navReviews: 'CLIENT REVIEWS',
      navReserve: 'RESERVE SLOT',
      bookNow: 'BOOK NOW',
      marquee1: 'GRAND OPENING: NashGlam Lash Studio is now fully based in Terrebonne!',
      marquee2: 'Lash extensions crafted with care, from a home studio in Terrebonne!',
      toggleLight: 'Switch to Light Mode',
      toggleDark: 'Switch to Dark Mode',
      reserved: 'Reserved',
      appointmentConfirmed: 'APPOINTMENT CONFIRMED:',
      appointmentBody: 'Your lash session is secured with',
      appointmentOn: 'on',
      appointmentAt: 'at',
      emailSent: 'A confirmation email has been dispatched to',
      exactLocation: 'Exact home studio location: 2197 Rue De Fontainebleau, Mascouche, QC.',
      dismiss: 'DISMISS',
    },

    // ── HERO ────────────────────────────────────────────────────────────────
    hero: {
      tag: 'Terrebonne Home Lash Studio',
      title: 'Crafted',
      titleAccent: 'Elegance',
      subtitle: 'Custom lash extensions crafted with care.',
      ctaPrimary: 'DESIGN YOUR SET',
      ctaSecondary: 'VIEW ESSENTIALS',
      scrollLabel: 'Scroll to Discover',
    },

    // ── CATALOG / CLEAN KIT ─────────────────────────────────────────────────
    catalog: {
      badge: 'Hygiene Essentials',
      title: 'NashGlam Lash Clean Kit',
      subtitle:
        'Maintain professional retention after your appointments. Our oil-free cleansing solution works to preserve fiber bonds and keep your lashes fluffy and clean.',
      bestSeller: '★ BEST-SELLER',
      formula: 'pH 5.5 Tear-Free Formula',
      retentionMaximizer: 'RETENTION MAXIMIZER',
      productName: 'Lash Cleaning Package',
      description:
        'Expertly formulated to eliminate make-up residues, oils, and environmental build-up while extending extension retention up to 4+ weeks.',
      inclusionsLabel: 'PACKAGE INCLUSIONS:',
      benefits: [
        'Deep cleansing bubble wash (60ml foaming bottle)',
        'Ultra-soft customized antimicrobial washing brush',
        'Two long-retention extension lash spoolies',
        'Elegant protective travel protection pouch',
      ],
      addToBag: 'ADD PACKAGE TO BAG',
      addedToBag: 'ADDED TO YOUR BAG',
    },

    // ── BOOKING FORM ────────────────────────────────────────────────────────
    booking: {
      badge: 'Booking Concierge',
      titleForm: 'Reserve Your Lash Therapy',
      titleDeposit: 'Secure Booking Deposit',
      descForm:
        'Each session includes a customized lash-bed diagnostic consultation, relaxing underbed collagen gel pads, micro-fanned lash mapping, and ultimate safety care.',
      descDeposit:
        'To hold your custom-styled lashes slot with Nash inside our calendar space, a private non-refundable $25.00 deposit is secured.',
      step1: '1. SELECT TREATMENT LOOK',
      step2: '2. SELECT BOOKING DATE',
      step3: '3. CHOOSE TIME',
      step4: '4. GUEST INTAKE DETAILS',
      confirm: 'Confirm',
      editDetails: '← Edit Intake Details',
      namePlaceholder: 'Your Full Name *',
      emailPlaceholder: 'Email Address *',
      phonePlaceholder: 'Mobile Phone Number *',
      notesPlaceholder:
        'Consultation notes, lash allergies, requested curl mapping details (optional)...',
      months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      weekdays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      reservationSummary: '★ RESERVATION INFORMATION SUMMARY ★',
      lashLook: 'LASH LOOK TREATMENT',
      dateTime: 'DATE & TIME',
      masterStylist: 'MASTER STYLIST',
      leadStylist: 'Lead Stylist & Owner',
      depositPolicy: '★ DEPOSIT POLICY ★',
      depositText:
        'A <strong>$25.00 deposit</strong> is required to confirm your styled appointment. This deposit is <strong>non-refundable but transferable to a rescheduled appointment with 24 hours notice</strong>. If you reschedule prior to 24 hours before your booking, the $25.00 applies to your newly selected slot. However, if you cancel or reschedule late, the deposit will not be returned or applied.',
      pleaseRead: 'PLEASE READ before proceeding!',
      secureCheckout: 'Checkout',
      cardPlaceholder: 'Card Number (e.g. 4111 2222 3333 4444) *',
      securedDeposit: 'Secured Deposit Charge',
      cashmere: 'Formaldehyde-free luxury cashmere silk lashes.',
      getBooked: "Let's get you booked!",
      alertSelectProduct: 'Please select a lash look model style first.',
      alertName: 'Please enter your name.',
      alertEmail: 'Please enter a valid email address.',
      alertPhone: 'Please enter your phone contact details.',
      alertContactDetails: 'Please provide name, email, and phone contact details to secure the booking.',
      alertCardNumber: 'Please enter a valid 16-digit card number to pay the $25.00 booking deposit.',
      alertExpiry: 'Please enter a valid expiration date (MM/YY).',
      alertCvc: 'Please enter a valid CVV (3-digit security code).',
      // Voucher
      appointmentConfirmed: 'Appointment Confirmed!',
      voucherEmailSent: 'We have dispatched your styling sequence blueprint to',
      voucherRead: 'Read your voucher below.',
      voucherHeader: 'LASH STUDIO VOUCHER',
      paidDeposit: 'PAID DEPOSIT',
      treatmentArtist: 'TREATMENT & ARTIST',
      stylist: 'Stylist:',
      scheduledDate: 'SCHEDULED DATE',
      arrivalTime: 'ARRIVAL TIME',
      guestDetails: 'GUEST DETAILS',
      billingSummary: 'BILLING SUMMARY',
      treatmentPrice: 'Treatment Set Price:',
      depositPaid: 'Deposit Secured/Paid:',
      remainingDue: 'Remaining Salon Due:',
      depositNote: '* Policy: Deposit is non-refundable but transferable to a rescheduled appointment with 24 hours notice.',
      addToCalendar: 'ADD TO CALENDAR (.ICS)',
      bookAnother: 'Book Another Treatment Slot Or Service',
      mins: 'mins',
    },

    // ── CLIENT REVIEWS ───────────────────────────────────────────────────────
    reviews: {
      badge: 'Client Diaries',
      title: 'NashGlam Client Reviews',
      subtitle:
        'Read candid reviews from our beautiful community, or leave your own review below to share your custom style experience.',
      leaveReview: 'Leave a Review',
      leaveReviewDesc: 'Your feedback helps us maintain our beauty & luxury service standards.',
      nameLabel: 'Your Full Name',
      namePlaceholder: 'e.g. Charlotte Rose',
      starLabel: 'Star Rating',
      of5: 'of 5',
      serviceLabel: 'Lash Service / Product',
      reviewLabel: 'Your Review',
      reviewPlaceholder:
        'Share details of your lash retention, lashes soft feel, and custom mapping results...',
      publish: 'PUBLISH MY REVIEW',
      communityScore: 'COMMUNITY SCORE',
      ratingOf: '/ 5.0 rating',
      reviews: 'reviews',
      verifiedClient: 'Verified Client',
      thankYou: 'Thank you, beautiful! Your review has been saved in local state and published successfully below.',
      errorName: 'Please provide your name to register your review.',
      errorText: 'Please write a detailed review (at least 10 characters) about your experience.',
    },

    // ── FAQs ─────────────────────────────────────────────────────────────────
    faqs: {
      title: 'Lash Safety & Maintenance Guide',
      subtitle:
        'Everything you need to know about our hypoallergenic materials, retention pacing, and professional eyelash care hygiene.',
      tip: 'Tips: Use oil-free cosmetics. Brush lashes only when dry. Never pull extensions out manually.',
      items: [
        {
          question: 'How should I prepare for my lash appointment?',
          answer:
            'Please arrive with completely clean eyes and clean skin—strictly no mascara, eyeliner, heavy facial oils, or lash curls. Avoid caffeine for 3-4 hours prior, as it can cause natural micro-fluttering of your eyelids during the precise application. If you wear contact lenses, we highly recommend bringing your storage case to remove them before under-eye gel pad application.',
        },
        {
          question: 'How do I wash my lash extensions, and are they waterproof?',
          answer:
            'Lash extensions are waterproof after our initial medical seal is dried using nano-misters, but proper luxury hygiene is paramount to prevent build-ups! Wash them daily after the first 24 hours using an oil-free Lash Foam Cleanser. Gently brush them through with a clean mascara wand only when they are 100% dry. Avoid heavy water pressure directly on your face during showers.',
        },
        {
          question: 'How long do extension sets last, and when should I get fills?',
          answer:
            'Your natural eyelashes shed organically at a rate of 2-5 lashes per day, mirroring standard body hair growth. Consequently, extensions typically last 4-6 weeks depending on retention care. We recommend scheduling Lash Fills every 2 to 3 weeks (with at least 40% of original extensions remaining) to clean, remove outgrown shafts, and fill new lash sprouts.',
        },
        {
          question: 'Will eyelash extensions damage my natural lash hair?',
          answer:
            'Absolutely not when applied by our certified advanced lash technicians. We strictly map custom diameters and lengths that match your natural follicle holding capacity. Our hand-fanned silk fibers are featherlight and applied using surgical-grade, low-fume medical-grade adhesive—leaving your underlying lash roots perfectly healthy and safe.',
        },
      ],
    },

    // ── CART DRAWER ──────────────────────────────────────────────────────────
    cart: {
      title: 'Your Luxury Bag',
      emptyTitle: 'Your bag is currently empty',
      emptyDesc:
        'Pick a lash extension set, take the style consultation quiz, or reserve a luxury therapy slot to continue.',
      browseServices: 'Browse Services Lookbook',
      reservedSlots: 'RESERVED SLOTS',
      customizedTreatments: 'CUSTOMIZED TREATMENTS',
      securedAppointment: 'SECURED APPOINTMENT',
      at: 'at',
      stylist: 'Styliste:',
      curl: 'CURL:',
      len: 'LEN:',
      cartSubtotal: 'Cart Subtotal',
      grandTotal: 'Grand Due Total',
      finalize: 'FINALIZE & LOCK BAG DEPOSIT',
      locking: 'LOCKED SECURING...',
      refundNote: 'Article fees are fully refundable up to 24 hours prior to appointment slot arrival.',
      orderLocked: 'Order Locked In!',
      orderLockedDesc:
        'Your luxurious lash mapping order, reservation holds, and bespoke care preparations have been queued at the boutique frontdesk.',
      boutiqueOrder: 'BOUTIQUE ORDER ID',
      totalItems: 'Total Processing Items',
      grandTotalClosed: 'Grand Total Closed',
      continueStudying: 'CONTINUE STUDYING DESIGNS',
    },

    // ── FOOTER ───────────────────────────────────────────────────────────────
    footer: {
      tagline:
        'Dedicated exclusively to custom-designed eyelash aesthetics. Handcrafted fiber fans with professional isolation guarantees.',
      studioLocation: 'STUDIO LOCATION',
      locationText: 'Private Home Studio',
      locationCity: 'Terrebonne, QC, Canada',
      hours: 'OPERATING HOURS',
      hoursText: 'Mon - Fri: 09:00 AM - 08:00 PM',
      satText: 'Sat: Closed',
      sunText: 'Sun: 10:00 AM - 06:00 PM',
      safety: 'SAFETY ACCREDITATION',
      cert1: 'NEESA Certified Stylists',
      cert2: 'Formaldehyde-Free Bonding',
      cert3: 'Sanitized Precision Tools',
      copyright: (year: number) =>
        `© ${year} NashGlam Lashes. All rights reserved. Elegant web design crafted for beauty excellence.`,
    },
  },

  // ════════════════════════════════════════════════════════════════════════════
  // FRENCH TRANSLATIONS
  // ════════════════════════════════════════════════════════════════════════════
  fr: {
    header: {
      brand: 'NASHGLAM',
      brandAccent: 'LASHES',
      navWelcome: 'ACCUEIL',
      navShop: 'BOUTIQUE SOIN',
      navReviews: 'AVIS CLIENTS',
      navReserve: 'RÉSERVER',
      bookNow: 'RÉSERVER',
      marquee1: 'GRANDE OUVERTURE : Le studio NashGlam est maintenant basé à Terrebonne!',
      marquee2: 'Extensions de cils faites avec soin, depuis un studio privé à Terrebonne!',
      toggleLight: 'Passer au mode clair',
      toggleDark: 'Passer au mode sombre',
      reserved: 'Réservé',
      appointmentConfirmed: 'RENDEZ-VOUS CONFIRMÉ :',
      appointmentBody: 'Votre session cils est sécurisée avec',
      appointmentOn: 'le',
      appointmentAt: 'à',
      emailSent: 'Un courriel de confirmation a été envoyé à',
      exactLocation: 'Adresse exacte du studio : 2197 Rue De Fontainebleau, Mascouche, QC.',
      dismiss: 'FERMER',
    },

    hero: {
      tag: 'Studio Privé de Cils à Terrebonne',
      title: 'Élégance',
      titleAccent: 'Artisanale',
      subtitle: 'Extensions de cils personnalisées, faites avec soin.',
      ctaPrimary: 'CRÉEZ VOTRE LOOK',
      ctaSecondary: 'VOIR LES ESSENTIELS',
      scrollLabel: 'Défiler pour découvrir',
    },

    catalog: {
      badge: 'Essentiels Hygiène',
      title: 'Kit Nettoyant NashGlam',
      subtitle:
        'Maintenez une rétention professionnelle après vos rendez-vous. Notre solution nettoyante sans huile préserve les liens fibreux et garde vos cils gonflés et propres.',
      bestSeller: '★ BEST-SELLER',
      formula: 'Formule Douce pH 5.5',
      retentionMaximizer: 'MAXIMISEUR DE RÉTENTION',
      productName: 'Forfait Nettoyage Cils',
      description:
        'Formulé expertement pour éliminer les résidus de maquillage, les huiles et les impuretés, tout en prolongeant la rétention des extensions jusqu\'à 4+ semaines.',
      inclusionsLabel: 'CONTENU DU FORFAIT :',
      benefits: [
        'Mousse nettoyante purifiante (flacon moussant 60ml)',
        'Brosse antimicrobienne ultra-douce personnalisée',
        'Deux spoulies pour extensions longue durée',
        'Pochette de voyage protectrice élégante',
      ],
      addToBag: 'AJOUTER AU SAC',
      addedToBag: 'AJOUTÉ À VOTRE SAC',
    },

    booking: {
      badge: 'Conciergerie de Réservation',
      titleForm: 'Réservez Votre Thérapie Cils',
      titleDeposit: 'Sécurisez votre Dépôt',
      descForm:
        'Chaque session comprend une consultation diagnostic personnalisée, des coussinets gel collagène relaxants, une cartographie micro-éventail et des soins de sécurité optimaux.',
      descDeposit:
        'Pour bloquer votre créneau personnalisé avec Nash dans notre agenda, un dépôt privé non remboursable de 25,00$ est requis.',
      step1: '1. SÉLECTIONNEZ LE TRAITEMENT',
      step2: '2. CHOISISSEZ LA DATE',
      step3: '3. CHOISISSEZ L\'HEURE',
      step4: '4. INFORMATIONS CLIENT',
      confirm: 'Confirmer',
      editDetails: '← Modifier les informations',
      namePlaceholder: 'Votre nom complet *',
      emailPlaceholder: 'Adresse courriel *',
      phonePlaceholder: 'Numéro de téléphone *',
      notesPlaceholder:
        'Notes de consultation, allergies, détails de cartographie (optionnel)...',
      months: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      monthsShort: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
      weekdays: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
      reservationSummary: '★ RÉSUMÉ DE LA RÉSERVATION ★',
      lashLook: 'TRAITEMENT CILS',
      dateTime: 'DATE & HEURE',
      masterStylist: 'STYLISTE PRINCIPALE',
      leadStylist: 'Styliste Principale & Propriétaire',
      depositPolicy: '★ POLITIQUE DE DÉPÔT ★',
      depositText:
        'Un <strong>dépôt de 25,00$</strong> est requis pour confirmer votre rendez-vous. Ce dépôt est <strong>non remboursable mais transférable à un rendez-vous reprogrammé avec 24 heures de préavis</strong>. Si vous reprogrammez avant 24 heures, le 25,00$ s\'applique à votre nouveau créneau. En cas d\'annulation ou de reprogrammation tardive, le dépôt ne sera pas remboursé.',
      pleaseRead: 'VEUILLEZ LIRE avant de continuer!',
      secureCheckout: 'Checkout',
      cardPlaceholder: 'Numéro de carte (ex. 4111 2222 3333 4444) *',
      securedDeposit: 'Dépôt Sécurisé',
      cashmere: 'Cils en soie cachemire sans formaldéhyde.',
      getBooked: 'Confirmez votre réservation!',
      alertSelectProduct: 'Veuillez sélectionner un style de cils en premier.',
      alertName: 'Veuillez entrer votre nom.',
      alertEmail: 'Veuillez entrer une adresse courriel valide.',
      alertPhone: 'Veuillez entrer vos coordonnées téléphoniques.',
      alertContactDetails: 'Veuillez fournir votre nom, courriel et téléphone pour sécuriser la réservation.',
      alertCardNumber: 'Veuillez entrer un numéro de carte valide à 16 chiffres pour payer le dépôt de 25,00$.',
      alertExpiry: 'Veuillez entrer une date d\'expiration valide (MM/AA).',
      alertCvc: 'Veuillez entrer un CVV valide (code de sécurité à 3 chiffres).',
      appointmentConfirmed: 'Rendez-vous Confirmé!',
      voucherEmailSent: 'Votre bon de style a été envoyé à',
      voucherRead: 'Lisez votre bon ci-dessous.',
      voucherHeader: 'BON DU STUDIO CILS',
      paidDeposit: 'DÉPÔT PAYÉ',
      treatmentArtist: 'TRAITEMENT & ARTISTE',
      stylist: 'Styliste :',
      scheduledDate: 'DATE PLANIFIÉE',
      arrivalTime: 'HEURE D\'ARRIVÉE',
      guestDetails: 'INFORMATIONS CLIENT',
      billingSummary: 'RÉSUMÉ DE FACTURATION',
      treatmentPrice: 'Prix du traitement :',
      depositPaid: 'Dépôt sécurisé/payé :',
      remainingDue: 'Solde restant au salon :',
      depositNote: '* Politique : Le dépôt est non remboursable mais transférable à un rendez-vous reprogrammé avec 24 heures de préavis.',
      addToCalendar: 'AJOUTER AU CALENDRIER (.ICS)',
      bookAnother: 'Réserver un autre créneau ou service',
      mins: 'min',
    },

    reviews: {
      badge: 'Journaux Clients',
      title: 'Avis Clients NashGlam',
      subtitle:
        'Lisez des avis sincères de notre belle communauté, ou laissez votre propre avis ci-dessous pour partager votre expérience.',
      leaveReview: 'Laisser un Avis',
      leaveReviewDesc: 'Vos commentaires nous aident à maintenir nos standards de beauté et de luxe.',
      nameLabel: 'Votre Nom Complet',
      namePlaceholder: 'ex. Charlotte Rose',
      starLabel: 'Évaluation par étoiles',
      of5: 'sur 5',
      serviceLabel: 'Service / Produit',
      reviewLabel: 'Votre Avis',
      reviewPlaceholder:
        'Partagez les détails sur la rétention, la douceur des cils et les résultats de cartographie...',
      publish: 'PUBLIER MON AVIS',
      communityScore: 'SCORE COMMUNAUTAIRE',
      ratingOf: '/ 5.0',
      reviews: 'avis',
      verifiedClient: 'Cliente Vérifiée',
      thankYou: 'Merci, belle! Votre avis a été enregistré et publié avec succès ci-dessous.',
      errorName: 'Veuillez fournir votre nom pour soumettre votre avis.',
      errorText: 'Veuillez rédiger un avis détaillé (au moins 10 caractères) sur votre expérience.',
    },

    faqs: {
      title: 'Guide de Sécurité & Entretien des Cils',
      subtitle:
        'Tout ce que vous devez savoir sur nos matériaux hypoallergéniques, le rythme de rétention et l\'hygiène professionnelle.',
      tip: 'Conseils : Utilisez des cosmétiques sans huile. Brossez les cils uniquement lorsqu\'ils sont secs. Ne tirez jamais sur les extensions manuellement.',
      items: [
        {
          question: 'Comment me préparer pour mon rendez-vous cils?',
          answer:
            'Veuillez arriver avec les yeux et la peau complètement propres — aucun mascara, eye-liner, huile faciale lourde ou recourbe-cils. Évitez la caféine pendant 3-4 heures avant, car elle peut provoquer de micro-flottements des paupières durant l\'application précise. Si vous portez des lentilles de contact, nous recommandons fortement d\'apporter votre étui pour les retirer avant l\'application des coussinets gel sous les yeux.',
        },
        {
          question: 'Comment laver mes extensions et sont-elles imperméables?',
          answer:
            'Les extensions sont imperméables après que notre scellant médical initial soit séché avec des nano-misters, mais une hygiène luxueuse adéquate est primordiale pour prévenir les accumulations! Lavez-les quotidiennement après les premières 24 heures avec un nettoyant moussant sans huile. Brossez-les délicatement avec une brosse mascara propre uniquement lorsqu\'elles sont 100% sèches. Évitez la pression d\'eau forte directement sur le visage sous la douche.',
        },
        {
          question: 'Combien de temps durent les extensions et quand faire des retouches?',
          answer:
            'Vos cils naturels tombent organiquement à un rythme de 2-5 cils par jour, reflétant la croissance normale des poils. Par conséquent, les extensions durent généralement 4-6 semaines selon les soins de rétention. Nous recommandons de planifier des retouches toutes les 2 à 3 semaines (avec au moins 40% des extensions d\'origine restantes) pour nettoyer, retirer les tiges trop longues et remplir les nouvelles pousses.',
        },
        {
          question: 'Les extensions endommagent-elles mes cils naturels?',
          answer:
            'Absolument pas lorsqu\'elles sont appliquées par nos techniciennes avancées certifiées. Nous cartographions rigoureusement des diamètres et longueurs personnalisés correspondant à la capacité naturelle de vos follicules. Nos fibres de soie éventail sont légères comme une plume et appliquées avec une colle médicale de qualité chirurgicale à faibles émanations — laissant vos racines de cils sous-jacentes parfaitement saines et sûres.',
        },
      ],
    },

    cart: {
      title: 'Votre Sac de Luxe',
      emptyTitle: 'Votre sac est vide',
      emptyDesc:
        'Choisissez une extension de cils, passez le quiz de style ou réservez un créneau de thérapie luxueuse pour continuer.',
      browseServices: 'Parcourir le Lookbook',
      reservedSlots: 'CRÉNEAUX RÉSERVÉS',
      customizedTreatments: 'TRAITEMENTS PERSONNALISÉS',
      securedAppointment: 'RENDEZ-VOUS SÉCURISÉ',
      at: 'à',
      stylist: 'Styliste :',
      curl: 'BOUCLE :',
      len: 'LONG :',
      cartSubtotal: 'Sous-total',
      grandTotal: 'Total Général',
      finalize: 'FINALISER ET SÉCURISER LE DÉPÔT',
      locking: 'SÉCURISATION EN COURS...',
      refundNote: 'Les frais d\'articles sont entièrement remboursables jusqu\'à 24 heures avant le rendez-vous.',
      orderLocked: 'Commande Sécurisée!',
      orderLockedDesc:
        'Votre commande de cartographie cils luxueuse, les réservations et les préparations de soins ont été mises en file d\'attente à la réception du studio.',
      boutiqueOrder: 'NUMÉRO DE COMMANDE',
      totalItems: 'Articles en traitement',
      grandTotalClosed: 'Total Final',
      continueStudying: 'CONTINUER À EXPLORER',
    },

    footer: {
      tagline:
        'Dédié exclusivement à l\'esthétique des cils sur mesure. Éventails fibreux artisanaux avec garanties d\'isolation professionnelle.',
      studioLocation: 'EMPLACEMENT DU STUDIO',
      locationText: 'Studio Privé à Domicile',
      locationCity: 'Terrebonne, QC, Canada',
      hours: 'HEURES D\'OUVERTURE',
      hoursText: 'Lun - Ven : 09h00 - 20h00',
      satText: 'Sam : Fermé',
      sunText: 'Dim : 10h00 - 18h00',
      safety: 'ACCRÉDITATIONS SÉCURITÉ',
      cert1: 'Stylistes Certifiées NEESA',
      cert2: 'Collage Sans Formaldéhyde',
      cert3: 'Outils de Précision Stérilisés',
      copyright: (year: number) =>
        `© ${year} NashGlam Lashes. Tous droits réservés. Design web élégant conçu pour l'excellence beauté.`,
    },
  },
} as const;

export type Translations = typeof translations.en;
