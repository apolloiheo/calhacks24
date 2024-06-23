import json
import os
import openai
from pydantic import BaseModel
import time

openai.api_key = os.getenv("OPENAI_API_KEY", "your-api-key")

class OpenAIAgent:
    client = openai.OpenAI()

    def call(self, prompt='', query='', model:type[BaseModel]=None, schema=None, **kwargs):
        '''query required'''
        assert query
        kwargs['model'] = kwargs.get('model', 'gpt-4o')
        kwargs['max_tokens'] = kwargs.get('max_tokens', 4096)

        messages = [
            {"role": "system", "content": prompt or "You are a helpful assistant."},
            {"role": "user", "content": query},
        ]

        if model and not schema:
            schema = self.generate_schema_one_layer(model)

        # LLM call
        start_time = time.time()
        max_timeout_api = 240; sleep_time = 1
        llm_result = None
        while time.time() - start_time < max_timeout_api:
            try:
                if schema:
                    llm_result = self.client.chat.completions.create(
                        messages=messages,
                        stream=False,
                        functions=[schema],
                        **kwargs
                    )
                    try:
                        llm_output = llm_result.choices[0].message.function_call.arguments
                    except:
                        llm_output = llm_result.choices[0].message.content
                else:
                    llm_result = self.client.chat.completions.create(
                        messages=messages,
                        stream=False,
                        **kwargs
                    )
                    llm_output = llm_result.choices[0].message.content
                break
            except openai.APIConnectionError as e:
                print('error', e)
                time.sleep(sleep_time)

        if llm_result is None: return None

        print(llm_result)
        print(llm_output)
        if schema:
            try:
                json_response = json.loads(llm_output.replace("```json\n", "").replace("\n```", ""))
                return json_response
                # print(json_response)
                # return model.model_validate(json_response, strict=False)
            except: pass
        return llm_output


    @staticmethod
    def generate_schema_one_layer(model:type[BaseModel]) -> dict:
        annotations = model.__annotations__
        return {
            "name": "return_answer",
            "description": "parsing function to format responses from GPT",
            "parameters": {
                "type": "object",
                "properties": {
                    key: {
                        "type": {
                            str: "string",
                            bool: "boolean",
                            int: "integer",
                            float: "number",
                        }[value]
                    }
                    for key, value in annotations.items()
                }
            },
            "required": list(annotations.keys()),
        }

class Paragraph:
    paragraph: int
    score: float

def get_paragraph(emotion: str, paragraphs: list[str]):
    agent = OpenAIAgent()
    return agent.call(
        prompt=f"You are an agent, who for educational purposes will make one of the following paragraphs have this emotion: {emotion}",
        query="Choose one paragraph from the provided paragraphs and provide the paragraph number and on a scale of 0-1 how much this emotion should be emphasized." \
        + "\n".join([
            f"{i+1}. {para}\n"
            for i, para in enumerate(paragraphs)
        ]) + "\n\nRETURN VALID JSON",
        model=Paragraph
    )

def get_paragraphs(emotions: list[str], paragraphs: list[str]):
    copy = paragraphs.copy()
    chosen = {}
    for e in emotions:
        response = get_paragraph(e, paragraphs)
        chosen[e] = {'paragraph_ind': copy.index(paragraphs[response['paragraph']-1]),
                     'score': response['score']}
        paragraphs.pop(response['paragraph']-1)
    return chosen

if __name__ == '__main__':
    class WeatherModel(BaseModel):
        weather: str
        city: str
        
    agent = OpenAIAgent()
    agent.call(query="hi, can u get me weather of nyc", model=WeatherModel)

    get_paragraph("happy", ["hi how are you", "No"])