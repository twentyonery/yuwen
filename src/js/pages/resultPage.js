// src/js/pages/resultPage.js

import { loadAIConfig } from '../utils/api.js';

/**
 * 根据当前页面路径确定图片资源的相对路径
 * @returns {string} 图片资源的相对路径前缀
 */
function getImagePathPrefix() {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过result.html访问
        return '../../public/assets/relics/';
    } else {
        // 通过其他路径访问
        return 'public/assets/relics/';
    }
}

/**
 * 根据角色ID获取对应的背景图片文件名
 * @param {string} characterId - 角色ID
 * @returns {string} 背景图片文件名
 */
function getCharacterBackgroundImage(characterId) {
    const imageMap = {
        'zhang_heng': 'zhangheng2.jpg',
        'wang_zhihuan': 'wangzhihuan2.jpg',
        'jiang_kui': 'jiangkui2.jpg',
        'xipatiya': 'xipatiya2.jpg',
        'zhang_qian': 'zhnagqian2.jpg',  // 注意：文件名拼写与角色ID略有不同
        'cao_xueqin': 'caoxueqin2.jpg',
        'wang_ximeng': 'wangximeng2.jpg'
    };
    
    return imageMap[characterId] || 'start.jpg'; // 默认使用start.jpg
}

// 为每个角色准备的详细介绍文本
// 在实际项目中，这些文本可以更长、更详细，甚至可以从一个单独的数据文件加载
const characterDetails = {
    "zhang_heng": `张衡 (78年-139年)，字平子，汉族，南阳西鄂（今河南南阳市石桥镇）人，东汉时期杰出的天文学家、数学家、发明家、地理学家、文学家。他在中国古代科学技术史上留下了浓墨重彩的一笔。

张衡在天文学方面著有《灵宪》、《浑天仪图注》等重要文献，阐述了宇宙的无限性和地球在宇宙中的位置，对当时的宇宙结构理论——浑天说进行了系统性的完善。他精通机械制造，发明了世界上第一台用水力驱动的浑天仪，能够模拟天体运行。更令人惊叹的是，他创造了世界上第一台地震仪——地动仪，能够测定地震发生的方向，这在当时是无与伦比的成就。

除了科学，张衡在文学上也颇有建树，以《二京赋》、《归田赋》等作品闻名于世，其文辞优美，铺陈华丽，展现了他广博的学识和丰富的内心世界。张衡的一生，是科学与文学交融的典范，他以非凡的智慧和创造力，成为了中国古代科技文明的杰出代表。`,

    "wang_zhihuan": `王之涣 (688年-742年)，字季凌，祖籍晋阳（今山西太原），后迁居绛州（今山西新绛县）。盛唐时期著名的边塞诗人，与高适、岑参等并称。

尽管王之涣流传至今的诗歌仅有六首，但每一首都堪称精品，尤以《登鹳雀楼》和《凉州词》最为脍炙人口。《登鹳雀楼》中“白日依山尽，黄河入海流。欲穷千里目，更上一层楼。”这四句诗，以其雄浑壮阔的意境和富有哲理的笔触，成为了千古传诵的名篇，激励着无数后人不断进取。《凉州词》中的“黄河远上白云间，一片孤城万仞山。羌笛何须怨杨柳，春风不度玉门关。”则描绘了西北边塞的苍凉景象，抒发了戍边将士的思乡之情。

王之涣的诗歌风格豪放雄浑，意境开阔，充满了盛唐的时代气象。他用简洁而精准的语言，勾勒出盛唐边塞的壮丽画卷，其作品在中国文学史上占有重要地位。`,

    "jiang_kui": `姜夔 (约1155年-约1221年)，字尧章，号白石道人，南宋时期的文学家、音乐家。他多才多艺，精通诗词、书法、音乐，尤其在词的创作上成就卓著，是南宋“清雅词派”的代表人物。

姜夔的词作题材广泛，多纪游、咏物、抒怀之作。他的词风“清空骚雅”，讲究意境的营造和语言的锤炼，追求一种空灵淡雅、幽远深邃的美学境界。其代表作《扬州慢》通过今昔对比，抒发了对国家兴衰和个人身世的感慨，情调凄清，意境深远。

除了文学创作，姜夔在音乐上的造诣也极高。他不仅擅长作词，还能自度曲，精通音律。他留存下的十七首自度曲，旁注了工尺谱，是研究宋代音乐的珍贵资料。他能弹奏多种乐器，尤其善吹箫，其音乐才华在当时备受推崇。姜夔以其独特的艺术风格和深厚的学养，成为了宋代文化艺术领域的一位奇才。`,

    "xipatiya": `西帕提亚 (约公元前1世纪-公元1世纪)，一位活跃在古波斯帝国丝绸之路上的杰出女性贵族和商人。

在那个以男性为主导的商贸世界里，西帕提亚凭借其敏锐的商业嗅觉、卓越的语言天赋和对不同文化的深刻理解，建立起了一个横跨东西的贸易网络。她不仅精通波斯语、希腊语，还能说流利的汉语和几种中亚方言，这使她能够与沿途各个驿站、绿洲城市以及遥远长安的商人们无障碍交流。

她所携带的货物，从精美的波斯地毯、璀璨的青金石，到东方的丝绸、香料，无一不是精心挑选的珍品。她不仅是一位成功的商人，更是一位文化使者，将东西方的物产、艺术乃至思想在漫长的商路上进行着无声的交换与融合。她的故事，是古代丝绸之路无数传奇中的一个缩影，展现了女性在历史长河中的智慧与力量。`,

    "zhang_qian": `张骞 (约公元前164年-公元前114年)，汉中郡城固（今陕西省城固县）人，西汉时期杰出的外交家、旅行家、探险家，被誉为“丝绸之路的开拓者”。

在汉武帝时期，为了联合大月氏共同抗击匈奴，张骞奉命出使西域。他率领使团，从长安出发，踏上了这条充满未知与艰险的道路。在出使过程中，他被匈奴囚禁长达十余年，但他始终没有忘记自己的使命。最终，他寻机逃脱，继续西行，历经千辛万苦，终于到达了大月氏。

虽然联合大月氏的外交目的未能完全达成，但张骞的凿空之旅却取得了意想不到的巨大成果。他亲身走访了大宛、康居、大月氏、大夏等西域诸国，详细了解了当地的风土人情、物产资源和军事地理情况。他将这些宝贵的信息带回了长安，使汉朝第一次对遥远的西域有了全面而清晰的认识。

张骞的出使，正式打通了中原与西域之间的通道，为后来的丝绸之路的繁荣奠定了坚实的基础。他的勇敢、坚韧和对未知世界的探索精神，成为了中华民族宝贵的精神财富。`,

    "cao_xueqin": `曹雪芹 (约1715年-约1763年)，名霑，字梦阮，号雪芹，又号芹圃、芹溪，清代内务府正白旗包衣世家出身。

曹雪芹的家族曾是显赫一时的江宁织造，但后来家道中落，经历了从“钟鸣鼎食之家”到“举家食粥酒常赊”的巨大变故。这段由盛转衰的家族史和个人坎坷经历，成为了他创作《红楼梦》的深厚生活基础和情感源泉。

他“披阅十载，增删五次”，以毕生心血铸就了这部不朽的巨著——《红楼梦》。这部作品以贾、史、王、薛四大家族的兴衰为背景，以贾宝玉、林黛玉、薛宝钗的爱情悲剧为主线，通过对“贾府”这一典型环境的细致描绘，深刻反映了封建社会末期的政治腐败、道德沦丧和必然崩溃的历史命运。

《红楼梦》不仅在思想内容上博大精深，在艺术表现上更是达到了中国古典小说的巅峰。其结构宏大而严谨，人物塑造栩栩如生，语言精纯而优美，诗词、建筑、园林、服饰、饮食、医药等方方面面的描写都极为丰富和精确。它不仅是中国文学的瑰宝，也是世界文学宝库中的一颗璀璨明珠。`,

    "wang_ximeng": `王希孟 (1096年-1096年之后)，北宋末期画家，年仅十八岁便在宋徽宗赵佶的亲自指导下，创作了举世闻名的绢本设色画卷《千里江山图》。

这幅纵51.5厘米，横1191.5厘米的鸿篇巨制，以其磅礴的气势、精湛的技法和绚丽的色彩，成为了中国青绿山水画的巅峰之作。画卷描绘了祖国的锦绣江山，峰峦叠嶂，江河交错，村落、桥梁、人物、车马等细节描绘得生动自然，展现了北宋江山的壮丽与秀美。

王希孟在创作此画时，运用了高超的绘画技艺，以矿物质颜料石青、石绿为主色，山峦顶部以赭石铺色，不同远近的山峦施以浓淡不一的色彩，使得整幅画面层次分明，色彩斑斓而又和谐统一。其用笔精细入微，笔法工整，一丝不苟，体现了北宋院体画的最高水准。

然而，这样一位才华横溢的青年画家，却如流星般划过历史的天空。关于他的生平，史书记载极少，创作完《千里江山图》后便再无音讯，英年早逝，给后人留下了无尽的遐想和遗憾。他短暂而辉煌的艺术生涯，以及这幅传世孤品《千里江山图》，共同构成了中国美术史上一个传奇。`
};

/**
 * 初始化结果页
 */
async function initResultPage() {
    try {
        // 从 sessionStorage 获取猜对的角色ID
        const characterId = sessionStorage.getItem('guessedCharacterId');
        if (!characterId) {
            // 如果没有角色信息，重定向到开始页
            alert('无效的访问。');
            window.location.href = '../../index.html';
            return;
        }

        // 加载AI配置以获取角色显示名（虽然文本已内嵌，但保持一致性）
        const config = await loadAIConfig();
        const character = config.characters[characterId];
        
        if (!character) {
            alert('未找到角色信息。');
            window.location.href = '../../index.html';
            return;
        }

        // 设置背景图片为对应人物图像(名字+2.jpg)
        const imagePathPrefix = getImagePathPrefix();
        const backgroundImage = getCharacterBackgroundImage(characterId);
        const resultPage = document.querySelector('.result-page');
        resultPage.style.backgroundImage = `url('${imagePathPrefix}${backgroundImage}')`;
        resultPage.style.backgroundSize = 'cover';
        resultPage.style.backgroundPosition = 'center';
        resultPage.style.backgroundRepeat = 'no-repeat';
        resultPage.style.minHeight = '100vh';
        resultPage.style.padding = '20px';
        resultPage.style.boxSizing = 'border-box';

        // 显示角色名称
        document.getElementById('character-name').textContent = character.display_name;

        // 显示角色详细介绍
        const infoElement = document.getElementById('character-info');
        const detailText = characterDetails[characterId];
        if (detailText) {
            infoElement.textContent = detailText;
        } else {
            infoElement.textContent = "暂无该角色的详细介绍。";
        }

        // 设置返回按钮事件监听器
        document.getElementById('back-button').addEventListener('click', () => {
            window.location.href = '../../index.html';
        });

    } catch (error) {
        console.error("Failed to initialize result page:", error);
        document.getElementById('character-info').textContent = "加载角色信息失败。";
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initResultPage);