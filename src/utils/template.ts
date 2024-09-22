type CreateDeletionRequest = {
  firstName: string
  lastName: string
  ssn: string
  email: string
}

export function createDeletionRequest({ email, firstName, lastName, ssn }: CreateDeletionRequest): string {
  return `Hej!

Jag vill härmed utöva min rätt till radering enligt artikel 17 i dataskyddsförordningen (GDPR).

Jag begär att alla personuppgifter som är kopplade till mig tas bort från er databas och webbplats.
Detta innebär att ingen person ska kunna se information om mig, inklusive rättsliga dokument och andra uppgifter kopplade till mitt namn och personnummer, på er tjänst.

Ni kan hitta information om era skyldigheter på Integritetsskyddsmyndighetens webbplats (www.imy.se).
Kammarrättens senaste avgörande fastställer att databaser som publicerar uppgifter för kommersiella syften inte anses ha ett journalistiskt ändamål och därför är skyldiga att följa GDPR.

Jag ser fram emot ert svar på min begäran om radering snarast möjligt. Ni får gärna kontakta mig om ni har några frågor.

Med vänliga hälsningar,
${firstName} ${lastName}
${ssn}
${email}
  `
}

// https://reportcontent.google.com/forms/rtbf
export function createSearchRemovalRequest({ firstName, lastName, ssn, email }: CreateDeletionRequest): string {
  return `This page is about me because it includes specific personal details, such as my name and address. 
  
(1) The content directly identifies me, and these details are private and sensitive.

(2) The continued presence of this information violates my rights under the General Data Protection Regulation (GDPR). Specifically, it infringes on my right to privacy and data protection as outlined in Article 17 (Right to Erasure) of the GDPR. The information is no longer necessary for the purposes for which it was originally collected or processed, and its continued publication is not justified by any overriding legitimate interest, thus requiring its removal to comply with EU data protection laws.`
}
