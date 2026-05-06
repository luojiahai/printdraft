<script setup lang="ts">
import {
  Resume, Name, Contact, Phone, Email, LinkedIn,
  Section, Experience, Education, Activity, Award, Skills, Category
} from '@printdraft/components'
</script>

<template>
  <Resume theme="resume-classic" font-size="10pt">
    <Name>Last, First</Name>
    <Contact>
      <Phone>+1 (555) 000-0000</Phone>
      <Email>email@example.com</Email>
      <LinkedIn>username</LinkedIn>
    </Contact>

    <Section title="Education">
      <Education institution="State University" location="City, State" degree="B.S. Computer Science" date="May 2024">
        <li>GPA: 3.9</li>
        <li>Relevant Coursework: Algorithms, Systems, Machine Learning</li>
      </Education>
    </Section>

    <Section title="Experience">
      <Experience org="Example Corp" location="City, State" title="Software Engineer Intern" date="Jun 2023 – Aug 2023">
        <li>Built and deployed scalable microservices handling 10k req/s</li>
        <li>Reduced CI pipeline time by 40% through parallelization</li>
      </Experience>
      <Experience org="Open Source Project" location="Remote" title="Contributor" date="Jan 2023 – Present">
        <li>Implemented feature X, merged after code review</li>
      </Experience>
    </Section>

    <Section title="Activities & Extracurriculars">
      <Activity org="Computer Science Club" location="City, State" role="President" date="Sep 2022 – Present" />
    </Section>

    <Section title="Awards & Accomplishments">
      <Award name="Dean's List" date="May 2023" />
      <Award name="Hackathon First Place" date="Nov 2022" description="Built a real-time collaboration tool in 24 hours." />
    </Section>

    <Section title="Skills & Interests">
      <Skills>
        <Category name="Programming">TypeScript, Python, Go, Java</Category>
        <Category name="Tools">Git, Docker, PostgreSQL, Linux</Category>
        <Category name="Interests">Open source, climbing, photography</Category>
      </Skills>
    </Section>
  </Resume>
</template>
