<script setup lang="ts">
import {
  CoverLetter, Sender, Recipient, Subject, Body, Closing
} from '@printdraft/components'
</script>

<template>
  <CoverLetter font-size="11pt">
    <Sender name="[NAME]" address="123 Main St, City, State 12345" email="[EMAIL]" date="[DATE]" />
    <Recipient name="Hiring Manager" company="Company Name" address="456 Corp Ave, City, State 67890" />
    <Subject>Application for Software Engineer Position</Subject>
    <Body>
      <p>Dear Hiring Manager,</p>
      <p>I am writing to express my strong interest in the Software Engineer position at Company Name. With my background in relevant experience, I am confident I would be a valuable addition to your team.</p>
      <p>In my previous role at Previous Company, I delivered key results that demonstrate my ability to [relevant skills]. I am eager to bring that same approach to Company Name.</p>
      <p>I am particularly drawn to Company Name because of its mission and product. I believe my skills align well with the requirements of this position.</p>
      <p>Thank you for considering my application. I look forward to discussing how my background can contribute to your team.</p>
    </Body>
    <Closing>
      <p>Sincerely,</p>
      <p>[NAME]</p>
    </Closing>
  </CoverLetter>
</template>
