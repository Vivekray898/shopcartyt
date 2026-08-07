// app/contact/page.tsx
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import ContactClient from "./ContactClient";
import type { Metadata } from "next";

// Generate metadata from Sanity data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await client.fetch(groq`
      *[_type == "contactPage"][0] {
        seoTitle,
        seoDescription,
        seoKeywords
      }
    `);

    return {
      title: data?.seoTitle || "Kontakt – FundGrube BestPreis",
      description:
        data?.seoDescription ||
        "Kontaktieren Sie FundGrube BestPreis. Wir beantworten gerne Ihre Fragen zu unseren Produkten, Angeboten und Filialen.",
      keywords: data?.seoKeywords?.join(", ") || "",
    };
  } catch (error) {
    return {
      title: "Kontakt – FundGrube BestPreis",
      description: "Kontaktieren Sie FundGrube BestPreis. Wir beantworten gerne Ihre Fragen zu unseren Produkten, Angeboten und Filialen.",
    };
  }
}

// Fetch data from Sanity
async function getContactPageData() {
  const query = groq`
    *[_type == "contactPage"][0] {
      heroTitle,
      heroSubtitle,
      heroImage {
        asset->
      },
      contactOptions[] {
        title,
        description,
        actionText,
        link,
        icon,
        color
      },
      formTitle,
      formSubtitle,
      formSuccessMessage,
      formErrorMessage,
      sidebarTitle,
      openingHours[] {
        day,
        time
      },
      quickResponseText,
      socialTitle,
      locationsTitle,
      locationsSubtitle,
      locations[] {
        name,
        address,
        city,
        phone,
        email,
        hours,
        coordinates,
        mapsUrl,
        embedUrl,
        image {
          asset->
        }
      },
      faqTitle,
      faqSubtitle,
      faqs[] {
        question,
        answer
      },
      seoTitle,
      seoDescription,
      seoKeywords
    }
  `;

  try {
    const data = await client.fetch(query, {}, { 
      next: { 
        revalidate: 60 // Revalidate every 60 seconds
      } 
    });
    
    console.log("Fetched contact data:", data); // Debug log
    
    // If data exists, merge with defaults to ensure all fields are present
    if (data) {
      return {
        ...getDefaultContactData(),
        ...data,
      };
    }
    
    return getDefaultContactData();
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return getDefaultContactData();
  }
}

// Default fallback data
function getDefaultContactData() {
  return {
    heroTitle: "Kontaktieren Sie uns",
    heroSubtitle: "Haben Sie Fragen zu unseren Produkten oder Dienstleistungen? Wir würden gerne von Ihnen hören.",
    heroImage: null,
    contactOptions: [
      {
        title: "Rufen Sie uns an",
        description: "Mo-Sa von 9:00 bis 20:00 Uhr",
        actionText: "+49 176 32853448",
        link: "tel:+4917632853448",
        icon: "phone",
        color: "blue",
      },
      {
        title: "Schreiben Sie uns",
        description: "Wir antworten innerhalb von 24 Stunden",
        actionText: "",
        link: "mailto:info@fundgrube.com",
        icon: "email",
        color: "green",
      },
      {
        title: "Besuchen Sie uns",
        description: "Zwei praktische Standorte",
        actionText: "Route planen",
        link: "#stores",
        icon: "map",
        color: "purple",
      },
    ],
    formTitle: "Nachricht senden",
    formSubtitle: "Füllen Sie das untenstehende Formular aus und wir melden uns so schnell wie möglich bei Ihnen.",
    formSuccessMessage: "Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.",
    formErrorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.",
    sidebarTitle: "Informationen",
    openingHours: [
      { day: "Montag - Samstag", time: "9:00 - 20:00" },
      { day: "Sonntag", time: "Geschlossen" },
    ],
    quickResponseText: "Wir antworten in der Regel innerhalb von 24 Stunden an Werktagen.",
    socialTitle: "Folgen Sie uns",
    locationsTitle: "Unsere Standorte",
    locationsSubtitle: "Besuchen Sie uns an einem unserer praktischen Standorte.",
    locations: [
      {
        name: "Fundgrube Aßweiler",
        address: "Aßweiler",
        city: "Aßweiler, Deutschland",
        phone: "+49 176 32853448",
        email: "assweiler@fundgrube.com",
        hours: "Mo-Sa: 9:00 - 20:00",
        coordinates: "49.2134, 7.1801",
        mapsUrl: "https://www.google.com/maps?q=Fundgrube+Sonderpostenmarkt+A%C3%9Fweiler",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2606.322878516748!2d7.1800750767101915!3d49.2134034756573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795cdce6b678f33%3A0x302e33a329f835f9!2sFundgrube%20Sonderpostenmarkt%2C%20Blumen%2C%20Gartencenter%2C%20A%C3%9Fweiler!5e0!3m2!1sen!2sin!4v1785411348624!5m2!1sen!2sin",
      },
      {
        name: "Best Preis Blieskastel",
        address: "Blieskastel",
        city: "Blieskastel, Deutschland",
        phone: "+49 176 32853448",
        email: "blieskastel@fundgrube.com",
        hours: "Mo-Sa: 9:00 - 20:00",
        coordinates: "49.2472, 7.3632",
        mapsUrl: "https://www.google.com/maps?q=Best+Preis+Textil+Schreibware+Baumarkt+Blieskastel",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.5416189021976!2d7.363204976711802!3d49.24717927326737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795d123d15c4abb%3A0xad008301e167ed7!2sBest%20Preis%20Textil%20Schreibware%20Baumarkt%20Artikel!5e0!3m2!1sen!2sin!4v1785411367261!5m2!1sen!2sin",
      },
    ],
    faqTitle: "Häufig gestellte Fragen",
    faqSubtitle: "Finden Sie schnelle Antworten auf die häufigsten Fragen unserer Kunden.",
    faqs: [
      {
        question: "Wie sind Ihre Öffnungszeiten?",
        answer: "Unsere Geschäfte sind Montag bis Samstag von 9:00 bis 20:00 Uhr geöffnet. Sonntags haben wir geschlossen.",
      },
      {
        question: "Bieten Sie Online-Shopping an?",
        answer: "Ja! Sie können unsere Produkte online durchstöbern und Bestellungen für die Abholung oder Lieferung aufgeben.",
      },
    ],
  };
}

// Server Component
export default async function ContactPage() {
  const data = await getContactPageData();
  
  // Add debug log
  console.log("Contact page data:", data);
  
  return <ContactClient data={data} />;
}