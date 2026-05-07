<script setup lang="ts">
import {
  Resume, Name, Contact, Phone, Email, LinkedIn,
  Section, Experience, Education, Activity, Award, Skills, Category
} from '@printdraft/components'
</script>

<template>
  <Resume theme="[THEME]" font-size="10pt">
    <Name>[NAME]</Name>
    <Contact>
      <Phone>[PHONE]</Phone>
      <Email>[EMAIL]</Email>
      <LinkedIn>[LINKEDIN]</LinkedIn>
    </Contact>

    <Section title="Education">
      <Education institution="University Name" location="City, State" degree="B.S. Computer Science" date="May 2024">
        <li>GPA: 3.9</li>
        <li>Relevant Coursework: Algorithms, Systems, Machine Learning</li>
      </Education>
    </Section>

    <Section title="Experience">
      <Experience org="Company Name" location="City, State" title="Software Engineer Intern" date="Jun 2023 – Aug 2023">
        <li>Action + Task → Outcome</li>
        <li>Action + Task → Outcome</li>
      </Experience>
    </Section>

    <Section title="Activities & Extracurriculars">
      <Activity org="Club or Organization Name" location="City, State" role="President / Role" date="Sep 2022 – Present" />
    </Section>

    <Section title="Awards & Accomplishments">
      <Award name="Award Name" date="May 2023" />
      <Award name="Award with Description" date="Nov 2022" description="Brief description of the award." />
    </Section>

    <Section title="Skills & Interests">
      <Skills>
        <Category name="Programming">Python, Go, TypeScript, Java</Category>
        <Category name="Tools">Git, Docker, PostgreSQL, Linux</Category>
        <Category name="Interests">Open source, climbing, photography</Category>
      </Skills>
    </Section>
  </Resume>
</template>
