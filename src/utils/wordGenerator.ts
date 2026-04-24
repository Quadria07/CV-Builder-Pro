import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
} from 'docx';
import { CVData } from '../types/cv';

export async function generateWord(cvData: CVData, fileName: string = 'CV.docx') {
  try {
    const children: any[] = [
      // Personal Info Header
      new Paragraph({
        text: cvData.personalInfo.name,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        run: new TextRun({
          bold: true,
          size: 32,
        }),
      }),

      // Contact Info
      new Paragraph({
        text: [
          cvData.personalInfo.email ? `${cvData.personalInfo.email}` : '',
          cvData.personalInfo.phone ? ` • ${cvData.personalInfo.phone}` : '',
          cvData.personalInfo.address ? ` • ${cvData.personalInfo.address}` : '',
        ]
          .filter(Boolean)
          .join(''),
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        run: new TextRun({
          size: 22,
        }),
      }),

      // Professional Summary
      ...(cvData.personalInfo.summary
        ? [
            new Paragraph({
              text: 'PROFESSIONAL SUMMARY',
              spacing: { before: 100, after: 100 },
              run: new TextRun({ bold: true, size: 26 }),
            }),
            new Paragraph({
              text: cvData.personalInfo.summary,
              spacing: { after: 300 },
              run: new TextRun({ size: 22 }),
            }),
          ]
        : []),

      // Skills
      ...(cvData.skills.length > 0
        ? [
            new Paragraph({
              text: 'SKILLS',
              spacing: { before: 100, after: 100 },
              run: new TextRun({ bold: true, size: 26 }),
            }),
            new Paragraph({
              text: cvData.skills.join(' • '),
              spacing: { after: 300 },
              run: new TextRun({ size: 22 }),
            }),
          ]
        : []),

      // Work History
      ...(cvData.workHistory.length > 0
        ? [
            new Paragraph({
              text: 'WORK EXPERIENCE',
              spacing: { before: 100, after: 100 },
              run: new TextRun({ bold: true, size: 26 }),
            }),
            ...cvData.workHistory.flatMap((work, idx) => [
              new Paragraph({
                text: work.position,
                spacing: { before: 100, after: 50 },
                run: new TextRun({ bold: true, size: 24 }),
              }),
              new Paragraph({
                text: `${work.company} • ${work.duration}`,
                spacing: { after: 100 },
                run: new TextRun({ italics: true, size: 22 }),
              }),
              ...work.responsibilities.map(
                (resp) =>
                  new Paragraph({
                    text: `• ${resp}`,
                    spacing: { after: 50 },
                    run: new TextRun({ size: 22 }),
                  })
              ),
              ...(idx < cvData.workHistory.length - 1
                ? [new Paragraph({ text: '', spacing: { after: 100 } })]
                : []),
            ]),
          ]
        : []),

      // Education
      ...(cvData.education.length > 0
        ? [
            new Paragraph({
              text: 'EDUCATION',
              spacing: { before: 200, after: 100 },
              run: new TextRun({ bold: true, size: 26 }),
            }),
            ...cvData.education.flatMap((edu, idx) => [
              new Paragraph({
                text: edu.degree,
                spacing: { before: 100, after: 50 },
                run: new TextRun({ bold: true, size: 24 }),
              }),
              new Paragraph({
                text: `${edu.institution} • ${edu.duration}`,
                spacing: { after: idx < cvData.education.length - 1 ? 150 : 300 },
                run: new TextRun({ italics: true, size: 22 }),
              }),
            ]),
          ]
        : []),

      // Projects
      ...(cvData.projects && cvData.projects.length > 0
        ? [
            new Paragraph({
              text: 'PROJECTS',
              spacing: { before: 200, after: 100 },
              run: new TextRun({ bold: true, size: 26 }),
            }),
            ...cvData.projects.flatMap((project, idx) => [
              new Paragraph({
                text: project.name,
                spacing: { before: 100, after: 50 },
                run: new TextRun({ bold: true, size: 24 }),
              }),
              new Paragraph({
                text: project.description,
                spacing: { after: idx < cvData.projects!.length - 1 ? 150 : 300 },
                run: new TextRun({ size: 22 }),
              }),
            ]),
          ]
        : []),

      // Languages
      ...(cvData.languages && cvData.languages.length > 0
        ? [
            new Paragraph({
              text: 'LANGUAGES',
              spacing: { before: 200, after: 100 },
              run: new TextRun({ bold: true, size: 26 }),
            }),
            ...cvData.languages.map((lang) =>
              new Paragraph({
                text: `${lang.name} - ${lang.proficiency}`,
                spacing: { after: 50 },
                run: new TextRun({ size: 22 }),
              })
            ),
            new Paragraph({ text: '', spacing: { after: 200 } }),
          ]
        : []),

      // Certifications
      ...(cvData.certifications && cvData.certifications.length > 0
        ? [
            new Paragraph({
              text: 'CERTIFICATIONS',
              spacing: { before: 200, after: 100 },
              run: new TextRun({ bold: true, size: 26 }),
            }),
            ...cvData.certifications.map((cert) =>
              new Paragraph({
                text: `${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ''}`,
                spacing: { after: 50 },
                run: new TextRun({ size: 22 }),
              })
            ),
            new Paragraph({ text: '', spacing: { after: 200 } }),
          ]
        : []),

      // Achievements & Awards
      ...(cvData.achievements && cvData.achievements.length > 0
        ? [
            new Paragraph({
              text: 'ACHIEVEMENTS & AWARDS',
              spacing: { before: 200, after: 100 },
              run: new TextRun({ bold: true, size: 26 }),
            }),
            ...cvData.achievements.map((achievement) =>
              new Paragraph({
                text: `• ${achievement}`,
                spacing: { after: 50 },
                run: new TextRun({ size: 22 }),
              })
            ),
            new Paragraph({ text: '' }),
          ]
        : []),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margins: {
                top: convertInchesToTwip(0.75),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.75),
                left: convertInchesToTwip(0.75),
              },
            },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate Word document'
    );
  }
}
