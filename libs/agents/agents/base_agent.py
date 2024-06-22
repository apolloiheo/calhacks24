import json
import os
import openai
from pydantic import BaseModel
import time

openai.api_key = os.getenv("OPENAI_API_KEY", "your-api-key")

class BaseAgent:
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
                    llm_output = llm_result.choices[0].message.function_call.arguments
                else:
                    llm_result = self.client.chat.completions.create(
                        messages=messages,
                        stream=False,
                        **kwargs
                    )
                    llm_output = output = llm_result.choices[0].message.content
                break
            except openai.APIConnectionError as e:
                print('error', e)
                time.sleep(sleep_time)

        if llm_result is None: return None

        if schema:
            try:
                json_response = json.loads(llm_output)
                return model.model_validate(json_response, strict=False)
            except: pass
        return llm_result


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



if __name__ == '__main__':
    class WeatherModel(BaseModel):
        weather: str
        city: str
        
    agent = BaseAgent()
    agent.call(query="hi, can u get me weather of nyc", model=WeatherModel)

