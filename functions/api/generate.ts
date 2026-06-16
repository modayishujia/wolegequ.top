const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM_PROMPT = `你是一位资深的科技自媒体内容策划专家，擅长创造爆款科技内容。
你的任务是根据用户选择的方向，生成一个科技赛道的爆款内容 Prompt。

要求：
1. 标题必须吸引眼球，带有悬念或冲击力
2. 内容方向要切中当下科技热点
3. 要有明确的目标受众
4. 要包含具体的创作方向和角度
5. 适合在抖音、小红书、B站、微信公众号等平台发布

请用以下格式输出：

📌 爆款标题：（一个吸引眼球的标题）
🎯 内容方向：（具体的内容创作方向）
👥 目标受众：（目标人群画像）
💡 创作角度：（独特的切入角度）
🔥 热点关联：（关联的科技热点/趋势）
📱 适合平台：（推荐发布平台及原因）
✍️ 内容大纲：（3-5个要点的大纲）`;

const TOPICS: Record<string, string> = {
  ai: 'AI人工智能相关，包括大模型、AI工具、AI应用、AI行业趋势、AI对各行业的影响',
  phone: '手机数码相关，包括新机发布、手机评测、数码配件、手机摄影技巧',
  car: '智能汽车相关，包括新能源车、自动驾驶、车机系统、充电技术',
  chip: '芯片半导体相关，包括国产芯片、制程工艺、芯片行业格局',
  space: '航天科技相关，包括商业航天、卫星互联网、太空探索',
  robot: '机器人相关，包括人形机器人、工业机器人、服务机器人',
  vr: 'XR/元宇宙相关，包括VR设备、AR应用、空间计算',
  quantum: '量子计算相关，包括量子优势、量子通信、量子应用',
  general: '综合科技热点，不限定具体方向，根据当下最热门的科技话题生成',
};

export const onRequestGet: PagesFunction<{ AI: Ai }> = async (context) => {
  const url = new URL(context.request.url);
  const topic = url.searchParams.get('topic') || 'general';
  const topicDesc = TOPICS[topic] || TOPICS['general'];

  try {
    const response = await context.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `请为以下科技方向生成一个爆款内容 Prompt：\n\n方向：${topicDesc}\n\n请直接输出结果，不要有任何前缀说明。` },
      ],
      max_tokens: 1024,
      temperature: 0.8,
    });

    return new Response(JSON.stringify({ success: true, prompt: (response as any).response }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};
