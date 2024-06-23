import asyncio
import os
from hume import HumeStreamClient
from hume.models.config import BurstConfig
from hume.models.config import ProsodyConfig, FaceConfig


hume_client = HumeStreamClient(os.getenv('HUME_API_KEY'))
configs = [FaceConfig(), ProsodyConfig()]

import threading
LOCK = threading.Lock()
files = []

def add_file(file: str):
    with LOCK:
        files.append(file)

async def hume_main():
    client = HumeStreamClient(os.getenv('HUME_API_KEY'))
    configs = [BurstConfig(), ProsodyConfig()]
    async with client.connect(configs) as socket:
        print('connected')
        while True:
            with LOCK:
                if len(files) == 0:
                    continue
                file = files.pop(0)
                print('pop file')
            result = await socket.send_file(file)
            print(result)
            await asyncio.sleep(0.1)

if __name__ == '__main__':
    asyncio.run(hume_main())
    print('hi')
