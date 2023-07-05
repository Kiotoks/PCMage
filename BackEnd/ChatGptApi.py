import os
import openai
openai.api_key = "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"
prompt = "Hello, my name is John and I am a software engineer."
model = "text-davinci-003"
response = openai.Completion.create(engine=model, prompt=prompt, max_tokens=50)

generated_text = response.choices[0].text
print(generated_text)
