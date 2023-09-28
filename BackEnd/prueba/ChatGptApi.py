import os
import openai
openai.api_key = "ingrese clave de chatgpt"
prompt = "Here is a list of PC processors with their prices: Ryzen 5 3600 $100, Intel I5 10400 $200, Ryzen 3 3200 $50. Here is a list of memory modules with their prices: kingston 4GB $25, corsair 8GB $50, samsung 16GB $75. Build a pc specification list with one processor and one memory stick that costs less than $150. I dont care about  having too much RAM i want to have the best cpu possible. Reduce your awnser to just the components separated by a comma and nothing more"
model = "gpt-3.5-turbo-instruct"
response = openai.Completion.create(engine=model, prompt=prompt, max_tokens=50)

generated_text = response.choices[0].text
print(generated_text)

os.system("pause")
