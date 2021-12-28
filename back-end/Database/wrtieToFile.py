import json
import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
database = client["TestDB2"]
collection = database["embeddings"]
task_definitions = collection.find({},{"x":1, "y" :1, "z":1, "categories":1, "definition":1,"source":1})

category_colour_dict = {
"Question Generation ":1,
"Coreference ":2,
"Question Answering ":3,
"Classification":4,
"Text Modification":5,
"Text Comparison":6,
"Question Generation":7,
"Text Span Selection":8,
"Paraphrasing":9,
"Classification ":10,
"Reasoning ":11,
"Text Generation":12,
"Text Generation ":12,
"Answer Generation":13,
"Text Modification ":14,
"Mathematics ":15,
"Unnatural Language Processing ":16,
"Proofreading ":17,
"Structured Text Processing ":18,
"Translation":19,
"Ethical Judgement":20,
"Multiple-Choice Question":21,
"Title Generation":22,
"Causal Reasoning":23,
"Verification ":24,
"Fill in the Blank":25,
"Semantic Parsing":26,
"Language Translation":27,
"Sentiment Classification":28,
"Text Completion":29,
"Text Compression":30,
"Binary Classification":31,
"Summarization":32,
"Title-Summary Generation":33,
"Multiple Choice QA Generation":34,
"Sentence Generation":35,
"Long Text Generation":36,
"Incorrect Answer Generation":37,
"Relevance Verification":38,
"Relationship Extraction":39,
"Token Classification":40,
"Sentiment Analysis":41,
"Grammar Error Correction":42,
"Grammar Error Detection":43,
"Answer Generation ":44,
"Classfication":45,
"Arithmetic":46,
"Entity Detection":47,
"text generation":48,
"Question Answering":49,
"Passage Generation":50,
"Structured Text Generation":51,
"Incorrect summarization":52,
"Counting":53,
"Text_Generation":54,
"Question_Generation":55,
"Slot Filling":56,
"Text Classification":57,
"Answer Generation in Spanish":58,
"Question Generation in Spanish":59,
"Language Identification":60,
"Text Summarization":61,
"Text-Classification":62,
"Incorrect Classification":63,
"Answer Selection":64,
"Question decomposition":65,
"Text Categorization":66,
"Correct Answer Generation":67,
"Reasoning":68,
"Order Generation":69,
"Ethical Judgment":70,
"Pronoun Disambiguation":71,
"Character Detection":72,
"Emotion Detection":73,
"Motivation Detection":74,
"Story Completion":75,
"Language Identification (Binary)":76,
"Unanswerable Question Generation":77,
"Generation":78,
"Event Detection":79,
"Document Sentiment Classification":80,
"Sentence Sentiment Classification":81,
"Sentence Sentiment Verification":82,
"Document Sentiment Verification":83,
"Context Generation":84,
"Options Generation":85,
"Emotion Detection ":86,
"Ner Generation":87,
"Explanation Generation":88,
"Named Entity Recognition":89,
"Medical subject heading(MESH) term Generation":90,
"Topic Generation":91,
"Answer Generation.":92,
"Multiple Choice Question Answering":93,
"Contextual Question Generation":94,
"Extractive":95,
"Paragraph Generation":96,
"Inquisitive Question generation":97,
"Span Detection":98,
"MCQ generation":99,
"MCQ answers generation":100,
"Primary Subject Recognition":101,
"Coreference Resolution":102,
"Reverse Coreference Resolution":103,
"Fill the Blank Coreference Resolution":104,
"Identification":105,
"Machine Translation":106,
"Information Retrieval":107,
"Word Generation":108,
"Word/Phrase Generation":109,
"Style Transfer":110,
"Text Generation, Paraphrase":111,
"Tabular Text Operation":112,
"Fact checking given context":113,
"Incorrect Fact Generation":114,
"Textual Entailment":115
}
category_colour_dict2 = {}
for key in category_colour_dict:
    category_colour_dict2[key] = category_colour_dict[key]
    category_colour_dict2[key.lower()] = category_colour_dict[key]

source_colour_dict = {
"quoref":1,
"mctaco":2,
"cosmosqa":3,
"drop":4,
"winogrande":5,
"qasc":6,
"essential (https://aclanthology.org/K17-1010.pdf)":7,
"miscellaneous":8,
"miscellaenous":9,
"multirc":10,
"ropes (https://allennlp.org/ropes)":11,
"Big Bench (https://github.com/google/BIG-bench) ":12,
"Synthetic":13,
"Time Travel (https://arxiv.org/abs/1909.04076)":14,
"Abductive NLI, https://arxiv.org/pdf/1908.05739.pdf":15,
"CommonsenseQA":16,
"SQuAD 1.1":17,
"SPLASH (https://arxiv.org/pdf/2005.02539.pdf)":18,
"conala (https://arxiv.org/pdf/1805.08949.pdf)":19,
"PIQA (https://arxiv.org/abs/1911.11641)":20,
"Babi (https://research.fb.com/downloads/babi/)":21,
"conala":22,
"pib":23,
"commongen (https://arxiv.org/abs/1911.03705)":24,
"semeval 2019 task10":25,
"Story Cloze and ROCStories (https://cs.rochester.edu/nlp/rocstories/)":26,
"Scruples":27,
"SPLASH (https://aclanthology.org/2020.acl-main.187/)":28,
"Context Abuse Detection":29,
"Multilingual TED (Qi et al., NAACL 2018)":30,
"SMS Spam Collection v.1 (https://www.dt.fee.unicamp.br/~tiago/smsspamcollection/)":31,
"Logic2Text":32,
"Asian Language Treebank(ALT)  (https://www2.nict.go.jp/astrec-att/member/mutiyama/ALT/)":33,
"ASSET (https://github.com/facebookresearch/asset)":34,
"Asian Language Treebank(ALT) (https://www2.nict.go.jp/astrec-att/member/mutiyama/ALT/)":35,
"X-CSR-QA dataset":36,
"Country-Capital-City Dataset(Dataset : https://data.world/samayo/country-capital-city/workspace/file?filename=country-by-capital-city.json":37,
"Country-Currency Dataset (Dataset : https://data.world/samayo/country-currency/file/country-by-currency-name.json":38,
"self":39,
"https://github.com/NancyFulda/BYU-Analogical-Reasoning-Dataset":40,
"Help! Need Advice on Identifying Advice (https://aclanthology.org/2020.emnlp-main.427.pdf)":41,
"CODA-19 (Dataset - https://github.com/windx0303/CODA-19/tree/master/data) (Paper - https://aclanthology.org/2020.nlpcovid19-acl.6.pdf)":42,
"Penn Treebank ( https://catalog.ldc.upenn.edu/LDC99T42 )":43,
"Brown corpus ( http://korpus.uib.no/icame/brown/bcm.html )":44,
"XCOPA (\"https://arxiv.org/abs/2005.00333\")":45,
"Com2Sense (https://arxiv.org/abs/2106.00969)":46,
"Semantic Parser Localizer (https://github.com/stanford-oval/SPL)":47,
"Human Ratings of Natural Language Generation Outputs (https://researchportal.hw.ac.uk/en/datasets/human-ratings-of-natural-language-generation-outputs)":48,
"Liar (Dataset - https://huggingface.co/datasets/liar) (Paper - https://arxiv.org/pdf/1705.00648.pdf)":49,
"Indian Food 101 (Dataset : https://www.kaggle.com/nehaprabhavalkar/indian-food-101)":50,
"https://arxiv.org/abs/2106.04016":51,
"ATOMIC (paper: https://arxiv.org/pdf/2010.05953.pdf) (dataset: https://allenai.org/data/atomic-2020)":52,
"zest (https://github.com/allenai/zest)":53,
"scan (https://github.com/brendenlake/SCAN)":54,
"https://github.com/IBM/KPA_2021_shared_task":55,
"Multilingual Amazon Reviews (Dataset - https://huggingface.co/datasets/amazon_reviews_multi) (Paper - https://arxiv.org/pdf/2010.02573.pdf)":56,
"Country-Abbreviation Dataset(Dataset : https://data.world/samayo/country-abbreviation/workspace/file?filename=country-abbreviation.json":57,
"Country-calling-code Dataset(Dataset : https://data.world/samayo/country-calling-code/workspace/file?filename=country-by-calling-code.json":58,
"Country-National Dish Dataset(Dataset : https://github.com/drmonkeyninja/country.json/blob/master/src/country-by-national-dish.json":59,
"Country-Barcode-Prefix Dataset(Dataset : https://data.world/samayo/countries-by-barcode-prefix/workspace/file?filename=country-by-barcode-prefix.json":60,
"Country-Domain-TLD Dataset(Dataset : https://data.world/samayo/countries-tld/workspace/file?filename=country-by-domain-tld.json":61,
"Country-continent Dataset(Dataset : https://github.com/drmonkeyninja/country.json/blob/master/src/country-continent.json":62,
"Country-Government-Type Dataset(Dataset : https://github.com/drmonkeyninja/country.json/blob/master/src/country-government-type.json":63,
"Open Subtitles Datset (https://opus.nlpl.eu/OpenSubtitles.php)":64,
"Question & Answer zre (http://nlp.cs.washington.edu/zeroshot/)":65,
"DAIS (Dative Alternation and Information Structure) (Dataset - https://github.com/taka-yamakoshi/neural_constructions) (Paper - https://arxiv.org/pdf/2010.02375.pdf)":66,
"https://huggingface.co/datasets/BSC-TeMU/SQAC":67,
"https://huggingface.co/datasets/peixian/equity_evaluation_corpus":68,
"winowhy":69,
"https://huggingface.co/datasets/msr_text_compression":70,
"https://huggingface.co/datasets/amazon_us_reviews":71,
"GLUE RTE https://openreview.net/pdf?id=rJ4km2R5t7, https://dl.fbaipublicfiles.com/glue/data/RTE.zip":72,
"GLUE QQP https://openreview.net/pdf?id=rJ4km2R5t7, https://dl.fbaipublicfiles.com/glue/data/QQP-clean.zip":73,
"GLUE CoLA https://openreview.net/pdf?id=rJ4km2R5t7, https://dl.fbaipublicfiles.com/glue/data/CoLA.zip":74,
"GLUE STS-B https://openreview.net/pdf?id=rJ4km2R5t7, https://dl.fbaipublicfiles.com/glue/data/STS-B.zip":75,
"opus-100-corpus (https://github.com/EdinburghNLP/opus-100-corpus)":76,
"hind_encorp (https://lindat.mff.cuni.cz/repository/xmlui/)":77,
"Sentence Compression (dataset link- https://github.com/google-research-datasets/sentence-compression)":78,
"xlsum":79,
"numer-sense":80,
"Movie Rationales : https://www.cs.jhu.edu/~jason/papers/zaidan+al.nipswN8.pdf":81,
"HANS : https://arxiv.org/abs/1902.01007":82,
"Opus Ted Talks (https://huggingface.co/datasets/opus_tedtalks)":83,
"Health Fact (https://huggingface.co/datasets/health_fact)":84,
"News Commentary - https://huggingface.co/datasets/news_commentary":85,
"QUAREL (https://arxiv.org/abs/1811.08048)":86,
"detoxifying-lms (https://aclanthology.org/2021.naacl-main.190/)":87,
"deal_or_no_dialog (https://huggingface.co/datasets/deal_or_no_dialog)":88,
"meta_woz":89,
"europa_ecdc_tm  https://huggingface.co/datasets/europa_ecdc_tm":90,
"europa_ecdc_tm":91,
"OpenBookQA: https://allenai.org/data/open-book-qa":92,
"CLUE CMRC2018: https://github.com/ymcui/cmrc2018":93,
"dart (https://huggingface.co/datasets/dart)":94,
"ajgt_twitter_ar (https://huggingface.co/datasets/ajgt_twitter_ar)":95,
"youtube_caption_corrections (https://huggingface.co/datasets/youtube_caption_corrections)":96,
"BLESS dataset from \"How we BLESSed distributional semantic evaluation\"":97,
"MathQA ( https://math-qa.github.io/math-QA/ )":98,
"odd-man-out (https://github.com/gabrielStanovsky/odd-man-out)":99,
"Country-iso-numeric Dataset(Dataset : https://github.com/drmonkeyninja/country.json/blob/master/src/country-iso-numeric.json)":100,
"Country-independence-year Dataset(Dataset : https://github.com/drmonkeyninja/country.json/blob/master/src/country-independence-date.json)":101,
"Country-region-in-world Dataset(Dataset : https://github.com/drmonkeyninja/country.json/blob/master/src/country-region-in-world.json)":102,
"Country-region-in-world Dataset(Dataset : https://github.com/drmonkeyninja/country.json/blob/master/src/country-surface-area.json)":103,
"EVALution dataset from \"EVALution 1.0: an Evolving Semantic Dataset for Training and Evaluation of Distributional Semantic Models\"":104,
"HEAD-QA (https://huggingface.co/datasets/head_qa":105,
"HEAD-QA (https://huggingface.co/datasets/head_qa)":106,
"RO-STS-Parallel (https://huggingface.co/datasets/ro_sts_parallel)":107,
"DoQA: (dataset: http://www.ixa.eus/node/12931, paper: https://arxiv.org/pdf/2005.01328.pdf)":108,
"https://github.com/trunghlt/AdverseDrugReaction/tree/master/ADE-Corpus-V2":109,
"https://www.ncbi.nlm.nih.gov/research/bionlp/Data/disease/":110,
"https://biocreative.bioinformatics.udel.edu/tasks/biocreative-v/track-3-cdr/":111,
"The samples are from SubjQA dataset. They're filtered so that they only contain subjective questions and answers and exclude the ones without the answer in the text.":112,
"https://github.com/juand-r/entity-recognition-datasets/tree/master/data/BTC":113,
"afs (https://arxiv.org/pdf/1709.01887.pdf)":114,
"https://huggingface.co/datasets/jnlpba":115,
"https://metatext.io/datasets/biocreative-ii-gene-mention-recognition-(bc2gm)":116,
"https://paperswithcode.com/dataset/chemprot":117,
"https://huggingface.co/datasets/linnaeus":118,
"https://github.com/juand-r/entity-recognition-datasets/tree/master/data/AnEM":119,
"https://raw.githubusercontent.com/rishabhmisra/News-Headlines-Dataset-For-Sarcasm-Detection":120,
"https://www.kaggle.com/c/gse002":121,
"https://github.com/rezacsedu/Bengali-Hate-Speech-Dataset":122,
"https://github.com/eftekhar-hossain/Bengali-Restaurant-Reviews":123,
"https://github.com/eftekhar-hossain/Bengali-Book-Reviews/":124,
"DSTC3":125,
"Hatexplain":126,
"ROOT09 dataset from 'Path-based vs. Distributional Information in Recognizing Lexical Semantic Relations'":127,
"https://huggingface.co/datasets/flores":128,
"Imppres : https://huggingface.co/datasets/imppres":129,
"LiMiT: The Literal Motion in Text (Dataset - https://github.com/ilmgut/limit_dataset) (Paper - https://aclanthology.org/D15-1076.pdf)":130,
"QA-SRL (Dataset - https://github.com/huggingface/datasets/tree/master/datasets/qa_srl) (Paper - https://aclanthology.org/D15-1076.pdf)":131,
"tomqa (https://github.com/kayburns/tom-qa-dataset)":132,
"Scitailv1.1 - http://data.allenai.org/scitail":133,
"DailyDialog - https://huggingface.co/datasets/daily_dialog":134,
"https://huggingface.co/datasets/offenseval_dravidian":135,
"https://huggingface.co/datasets/peer_read":136,
"https://huggingface.co/datasets/ag_news":137,
"conll2022 (Dataset - https://huggingface.co/datasets/viewer/?dataset=conll2002)":138,
"wiqa":139,
"SciTail":140,
"Cnn-Dailymail":141,
"jfleg https://huggingface.co/datasets/jfleg":142,
"blimp https://huggingface.co/datasets/blimp":143,
"clickbait_news_bg":144,
"TriviaQA":145,
"ProPara (https://arxiv.org/abs/1805.06975)":146,
"cmrc2018 (https://huggingface.co/datasets/chr_en)":147,
"codah (https://aclanthology.org/W19-2008.pdf)":148,
"samsum (https://huggingface.co/datasets/samsum)":149,
"amazon_reviews_multi, https://arxiv.org/abs/2010.02573":150,
"amazon_reviews_multi, https://huggingface.co/datasets/amazon_reviews_multi, https://arxiv.org/abs/2010.02573":151,
"gigaword":152,
"eQASC-perturbed":153,
"scifact":154,
"BSC-TeMU/tecla":155,
"diplomacy_detection (https://huggingface.co/datasets/diplomacy_detection)":156,
"allocine (https://huggingface.co/datasets/allocine)":157,
"yahoo_answers_topics (https://huggingface.co/datasets/yahoo_answers_topics)":158,
"HuggingFace/event2Mind; https://huggingface.co/datasets/event2Mind#source-data":159,
"NYC; https://nlds.soe.ucsc.edu/source-blending-NLG":160,
"SMCalFlow: (dataset - https://www.mitpressjournals.org/doi/pdf/10.1162/tacl_a_00333)":161,
"Web_Question: (dataset - https://huggingface.co/datasets/web_questions)":162,
"SMCalFlow: dataset (https://www.mitpressjournals.org/doi/pdf/10.1162/tacl_a_00333)":163,
"ethos":164,
"xquad":165,
"sick - https://huggingface.co/datasets/sick ":166,
"sick https://huggingface.co/datasets/sick ":167,
"ccaligned_multilingual - https://huggingface.co/datasets/ccaligned_multilingual ":168,
"cc-aligned - https://huggingface.co/datasets/ccaligned_multilingual ":169,
"menyo20k-mt (Dataset - https://huggingface.co/datasets/menyo20k_mt)":170,
"disfl_qa (Dataset - https://huggingface.co/datasets/disfl_qa) (Paper - https://arxiv.org/pdf/2106.04016.pdf)":171,
"classla/copa_hr":172,
"https://allenai.org/data/openpi":173,
"DoQA https://huggingface.co/datasets/doqa#data-fields":174,
"Adverserial QA https://huggingface.co/datasets/adversarial_qa#data-fields":175,
"Medical Question Pair Dataset https://github.com/curai/medical-question-pair-dataset ":176,
"Dataset Card for Catalonia Independence Corpus  https://github.com/ixa-ehu/catalonia-independence-corpus":177,
"Opus_books  https://opus.nlpl.eu/Books.php":178,
"MCScript (Dataset - http://www.sfb1102.uni-saarland.de/?page_id=2582) (Paper - https://arxiv.org/pdf/1803.05223.pdf)":179,
"['MKB', 'https://huggingface.co/datasets/mkb']":180,
"['GOOAQ', 'https://huggingface.co/datasets/gooaq']":181,
"Billsum (Link-https://huggingface.co/datasets/billsum)":182,
"super_glue (Link-https://huggingface.co/datasets/super_glue)":183,
"cedr (Dataset - https://huggingface.co/datasets/viewer/?dataset=cedr)":184,
"wino bias (Dataset - https://huggingface.co/datasets/viewer/?dataset=wino_bias)":185,
"TriangleCOPA (Dataset -'https://github.com/asgordon/TriangleCOPA') (Paper - https://people.ict.usc.edu/~gordon/publications/AAAI-SPRING15.PDF)":186,
"cail2018: https://huggingface.co/datasets/cail2018":187,
"md_gender_bias: https://huggingface.co/datasets/md_gender_bias":188,
"ClariQ (Dataset - https://github.com/aliannejadi/ClariQ) (Paper - https://arxiv.org/pdf/2009.11352.pdf)":189,
"BSC-TeMU/xquad-ca xquad":190,
"math_qa":191,
"StrategyQA (https://github.com/eladsegal/strategyqa)":192,
"menyo20k_mt":193,
"qed_amara":194,
"lj_speech https://huggingface.co/datasets/lj_speech#data-splits":195,
"PoKi(Paper - https://arxiv.org/pdf/2004.06188v4.pdf)(Dataset - https://github.com/whipson/PoKi-Poems-by-Kids)":196,
"convai3(Paper - https://arxiv.org/pdf/2009.11352.pdf)(Dataset - https://github.com/aliannejadi/ClariQ)":197,
"Civil Comments":198,
"Break: A Question Understanding Benchmark. This task is the same task used in the paper's crowd-sourcing.":199,
"Para-nmt (Dataset - https://www.cs.cmu.edu/~jwieting/) (Paper - https://arxiv.org/pdf/1711.05732.pdf)":200,
"QuaRTz (Qualitative Relationship Test set) (Dataset - https://allenai.org/data/quartz) (Paper - https://aclanthology.org/D19-1608.pdf)":201,
"Effective Crowd-Annotation of Participants, Interventions, and Outcomes in the Text of Clinical Trial Reports":202,
"Break: A Question Understanding Benchmark.":203,
"SNLI, https://nlp.stanford.edu/pubs/snli_paper.pdf":204,
"HotpotQA (dataset link- https://hotpotqa.github.io/)":205,
"DuoRC (https://github.com/duorc/duorc)":206,
"Sentiment140 (dataset link- http://help.sentiment140.com/for-students)":207,
"MultiNLI, https://cims.nyu.edu/~sbowman/multinli/paper.pdf":208,
"MultiNLI (paper: https://cims.nyu.edu/~sbowman/multinli/paper.pdf)":209,
"Unsupervised Stance Detection for Arguments from Consequences by Kobbe et. al. Link: https://aclanthology.org/2020.emnlp-main.4/":210,
"Logic2Text (dataset: https://github.com/czyssrs/Logic2Text, paper:https://arxiv.org/abs/2004.14579)":211,
"ROCStories, https://arxiv.org/pdf/1604.01696.pdf":212,
"Scruples (Paper: https://arxiv.org/abs/2008.09094, Dataset: https://github.com/allenai/scruples)":213,
"Curated from Stack Overflow - English. Link:https://data.stackexchange.com/english/queries":214,
"Curated from Stack Overflow - English":215,
"ARC (AI2 Reasoning Challenge) (Dataset - https://allenai.org/data/arc) (Paper - https://arxiv.org/pdf/1803.05457.pdf)":216,
"IIRC, https://aclanthology.org/2020.emnlp-main.86.pdf":217,
"TweetQA (dataset link- https://tweetqa.github.io/)":218,
"DREAM (https://github.com/nlpdata/dream)":219,
"Enhanced Winograd Schema Challenge dataset from the paper The Sensitivity of Language Models and Humans to Winograd Schema Perturbations (Paper: https://arxiv.org/abs/2005.01348)":220,
"Paper Reviews Dataset (dataset link- https://archive.ics.uci.edu/ml/datasets/Paper+Reviews)":221,
"CaseHOLD (https://github.com/reglab/casehold)":222,
"Counterfactual Story Reasoning and Generation; Paper Link: https://aclanthology.org/D19-1509.pdf":223,
"Europarl (dataset link- http://www.statmt.org/europarl/)":224,
"Overruling (https://github.com/reglab/casehold)":225,
"Combination of WSC and enhanced Winograd Schema Challenge dataset from the paper The Sensitivity of Language Models and Humans to Winograd Schema Perturbations":226,
"StereoSet (dataset: https://stereoset.mit.edu, paper: https://arxiv.org/abs/2004.09456)":227,
"Understanding Points of Correspondence between Sentences for Abstractive Summarization, paper:https://arxiv.org/abs/2006.05621":228,
"Scruples (paper: https://arxiv.org/abs/2008.09094)":229,
"Internet Movie Database (IMDB) (dataset link- https://ai.stanford.edu/~amaas/data/sentiment/)":230,
"OLID (paper: https://arxiv.org/abs/2004.13432)":231,
"Gigaword (dataset link- https://metatext.io/datasets/gigaword)":232,
"TellMeWhy (https://github.com/StonyBrookNLP/tellmewhy)":233,
"semeval 2020 task4 (paper: https://arxiv.org/abs/2007.00236)":234,
"StoryCommonsense (Dataset: https://uwnlp.github.io/storycommonsense/) (Paper: https://arxiv.org/pdf/1805.06533.pdf)":235,
"StoryCommonsense (Dataset - https://uwnlp.github.io/storycommonsense/) (Paper - https://arxiv.org/pdf/1805.06533.pdf)":236,
"Story Cloze (Dataset - https://cs.rochester.edu/nlp/rocstories/) (Paper - https://aclanthology.org/2020.latechclfl-1.19.pdf)":237,
"ReCoRD (https://arxiv.org/pdf/1810.12885.pdf)":238,
"where’s my head? definition, data set, and models for numeric fused-head identification and resolution":239,
"jeopardy (https://www.reddit.com/r/datasets/comments/1uyd0t/200000_jeopardy_questions_in_a_json_file/)":240,
"RACE (Dataset - http://www.cs.cmu.edu/~glai1/data/race/) (Paper - https://arxiv.org/pdf/1704.04683.pdf)":241,
"EuroParl (Dataset - http://www.statmt.org/europarl/)":242,
"CrowS-Pairs (dataset: https://github.com/nyu-mll/crows-pairs, paper: https://arxiv.org/pdf/2010.00133.pdf)":243,
"stereoset (https://arxiv.org/abs/2004.09456)":244,
"Jigsaw (dataset: https://www.kaggle.com/c/jigsaw-unintended-bias-in-toxicity-classification)":245,
"GAP (https://arxiv.org/pdf/1810.05201.pdf)":246,
"HateEval (dataset: https://github.com/cicl2018/HateEvalTeam)":247,
"WinoMT (dataset: https://github.com/gabrielStanovsky/mt_gender, paper: https://aclanthology.org/P19-1164.pdf)":248,
"HybridQA (https://arxiv.org/pdf/2004.07347.pdf),(https://github.com/wenhuchen/HybridQA)":249,
"HybridQA (https://arxiv.org/pdf/2004.07347.pdf), (https://github.com/wenhuchen/HybridQA)":250,
"Table 2 of Squad2.0 Paper https://arxiv.org/pdf/1806.03822.pdf":251,
"casino (https://aclanthology.org/2021.naacl-main.254.pdf)":252,
"Grounding Conversations with Improvised Dialogues; Paper Link: https://arxiv.org/pdf/2004.09544.pdf":253,
"SST2 Binary Polarity, https://aclanthology.org/D13-1170/":254,
"Instructions from https://aclanthology.org/2020.findings-emnlp.291.pdf and data from https://arxiv.org/pdf/1909.01326.pdf.":255,
"https://aclanthology.org/2020.emnlp-main.716.pdf":256,
"AG News Topic Classification, http://www.di.unipi.it/~gulli/AG_corpus_of_news_articles.html":257,
"BoolQ dataset":258,
"MATRES (http://cogcomp.org/papers/NingWuRo18.pdf), (https://github.com/CogComp/MATRES)":259,
"Social IQA (Dataset - https://maartensap.github.io/social-iqa/) (Paper - https://arxiv.org/pdf/1904.09728.pdf)":260,
"SemEval 2018 task3 (\"https://aclanthology.org/S18-1005.pdf\")":261,
"TORQUE dataset- https://allennlp.org/torque.html, crowd-sourcing template - https://qatmr.github.io":262,
"Human evaluations from paper COD3S: Diverse Generation with Discrete Semantic Signatures":263,
"PersianQA (https://github.com/sajjjadayobi/PersianQA)":264,
"SemEval 2018 task1 (\"https://aclanthology.org/S18-1001/\")":265,
"PAWS (\"https://arxiv.org/abs/1904.01130\")":266,
"Beyond I.I.D.: Three Levels of Generalization for Question Answering on Knowledge Bases":267,
"CREAK 2018 task1 (\"https://arxiv.org/pdf/2109.01653.pdf\")":268,
"The NarrativeQA Reading Comprehension Challenge":269,
"Common Sense Beyond English: Evaluating and Improving Multilingual Language Models for Commonsense Reasoning; Paper Link: https://arxiv.org/pdf/2106.06937.pdf":270,
"PerSenT: (dataset: https://github.com/MHDBST/PerSenT, paper: https://arxiv.org/pdf/2011.06128.pdf)":271,
"HindiEnglish Corpora (Dataset - https://www.kaggle.com/aiswaryaramachandran/hindienglish-corpora)":272,
"SentEval (\"https://arxiv.org/abs/1805.01070\")":273,
"eng_guj_parallel_corpus (Dataset - https://github.com/shahparth123/eng_guj_parallel_corpus) (Paper - https://arxiv.org/pdf/2002.02758.pdf)":274,
"https://huggingface.co/datasets/com_qa":275,
"https://huggingface.co/datasets/opus_paracrawl":276,
"SWAG: (dataset: https://github.com/rowanz/swagaf/tree/master/data, paper: https://arxiv.org/pdf/1808.05326.pdf)":277,
"Qasper (https://arxiv.org/abs/2105.03011)":278,
"PasiNLU (paper: https://arxiv.org/pdf/2012.06154.pdf) (dataset:https://github.com/persiannlp/parsinlu)":279,
"MRQA; Link: https://arxiv.org/abs/1910.09753":280,
"hasPart KB; Link: https://arxiv.org/abs/2006.07510":281,
"Yelp Polarity, https://proceedings.neurips.cc/paper/2015/file/250cf8b51c773f3f8dc8b4be867a9a02-Paper.pdf":282,
"CLS English, https://aclanthology.org/P10-1114/":283,
"CLS German, https://aclanthology.org/P10-1114/":284,
"CLS French, https://aclanthology.org/P10-1114/":285,
"CLS Japanese, https://aclanthology.org/P10-1114/":286,
"mwsc (https://huggingface.co/datasets/mwsc)":287,
"Amazon Review Polarity classification (https://huggingface.co/datasets/amazon_polarity)":288,
"Semeval  (https://www.cs.rochester.edu/u/nhossain/humicroedit.html)":289,
"SCRUPLES-Anecdotes: (dataset: https://github.com/allenai/scruples, paper: https://arxiv.org/pdf/2008.09094.pdf)":290,
"SCRUPLES-Dilemmas: (dataset: https://github.com/allenai/scruples, paper: https://arxiv.org/pdf/2008.09094.pdf)":291,
"Reddit TIFU dataset- https://aclanthology.org/N19-1260.pdf":292,
"Twitter Emotion Classification, https://aclanthology.org/D18-1404.pdf":293,
"Leakage-Adjusted Simulatability: Can Models Generate Non-Trivial Explanations of Their Behavior in Natural Language? (paper: https://arxiv.org/pdf/2010.04119.pdf)":294,
"emo (paper: https://huggingface.co/datasets/emo)":295,
"QANTA dataset (paper: https://aclanthology.org/D14-1070.pdf) (https://people.cs.umass.edu/~miyyer/qblearn/index.html)":296,
"News Editorials: Towards Summarizing Long Argumentative Texts (paper:https://aclanthology.org/2020.coling-main.470.pdf)":297,
"FarsTail (https://arxiv.org/abs/2009.08820)":298,
"Dataset Card for Asian Language Treebank (ALT)":299,
"Dataset Card for Asian Language Treebank (ALT) (https://huggingface.co/datasets/alt)":300,
"Dataset Card for DISCOFUSE (https://github.com/google-research-datasets/discofuse)":301,
"circa Dataset ((Dataset Link: https://huggingface.co/datasets/circa),(Paper Link: https://arxiv.org/pdf/2010.03450.pdf))":302,
"recipe-nlg ((Dataset Link: https://huggingface.co/datasets/recipe_nlg),(Paper Link: https://aclanthology.org/2020.inlg-1.4.pdf))":303,
"recipe-nlg ((Dataset Link: https://huggingface.co/datasets/recipe_nlg), (Paper Link: https://aclanthology.org/2020.inlg-1.4.pdf))":304,
"air_dialogue (Dialogue Based dataset) (Dataset - https://github.com/google/airdialogue) (Paper - https://aclanthology.org/D18-1419.pdf)":305,
"curiosity_dialogs(Conversational Curiosity Dataset) (Dataset - https://github.com/facebookresearch/curiosity) (Paper - https://aclanthology.org/2020.emnlp-main.655.pdf)":306,
"Natural Question (Dataset - https://ai.google.com/research/NaturalQuestions/visualization) (Paper - https://persagen.com/files/misc/kwiatkowski2019natural.pdf)":307,
"Universal Dependencies - English Dependency Treebank ( https://github.com/UniversalDependencies/UD_English-EWT )":308,
"Prepositional Paraprasing (Dataset - https://www.cse.iitb.ac.in/~girishp/nc-dataset/) (Paper - https://aclanthology.org/2020.findings-emnlp.386.pdf)":309,
"Amazon Fine Food Reviews (Dataset - https://metatext.io/datasets/amazon-fine-food-reviews)":310,
"SciQ: (dataset: https://ai2-public-datasets.s3.amazonaws.com/sciq/SciQ.zip, paper: https://www.aclweb.org/anthology/W17-4413.pdf)":311,
"MOCHA":312,
"https://huggingface.co/datasets/flores —flores":313,
"https://blog.einstein.ai/the-wikitext-long-term-dependency-language-modeling-dataset/":314,
"SBIC - https://huggingface.co/datasets/social_bias_frames":315,
"ConLLPP - https://huggingface.co/datasets/conllpp":316,
"Mutual (\"https://aclanthology.org/2020.acl-main.130.pdf\")":317,
"Yoruba BBC Topics (Dataset - https://huggingface.co/datasets/yoruba_bbc_topics) (Paper - https://aclanthology.org/2020.emnlp-main.204/)":318,
"GLUCOSE dataset:  https://github.com/ElementalCognition/glucose/  paper: https://arxiv.org/pdf/2009.07758.pdf":319,
"Wiki Movies (Dataset - https://huggingface.co/datasets/wiki_movies) (Paper - )":320,
"The Corpus of Linguistic Acceptability(CoLA) (Dataset - https://nyu-mll.github.io/CoLA/) (Paper - https://arxiv.org/pdf/1805.12471.pdf)":321,
"ohsumed dataset":322,
"XL-WiC (Dataset - https://huggingface.co/datasets/pasinit/xlwic)":323,
"dbpedia_14 (dataset link - https://huggingface.co/datasets/dbpedia_14)":324,
"allegro_reviews (dataset link - https://huggingface.co/datasets/allegro_reviews)":325,
"multi_woz_v22":326,
"e-SNLI Dataset https://github.com/OanaMariaCamburu/e-SNLI/blob/master/dataset/esnli_test.csv":327,
"e-SNLI Dataset https://github.com/OanaMariaCamburu/e-SNLI/blob/master/dataset/esnli_test.csv, https://nlp.stanford.edu/pubs/snli_paper.pdf":328,
"e-SNLI Dataset https://github.com/OanaMariaCamburu/e-SNLI/blob/master/dataset/esnli_test.csv, https://cims.nyu.edu/~sbowman/multinli/paper.pdf":329,
"REFreSD Dataset https://raw.githubusercontent.com/Elbria/xling-SemDiv/master/REFreSD/REFreSD_rationale":330,
"wiki-auto-all-data":331,
"huggingface":332,
"ParsiNLU (paper: https://arxiv.org/pdf/2012.06154.pdf) (dataset:https://github.com/persiannlp/parsinlu)":333,
"Measuring Massive Multitask Language Understanding tasks":334,
"SciTLDR (https://github.com/allenai/scitldr)":335,
"AmbigQA (Ambiguous Question Answering) (Dataset - https://nlp.cs.washington.edu/ambigqa/) (Paper - https://arxiv.org/pdf/2004.10645.pdf)":336,
"Amazon and Yelp Summarization Dataset(https://github.com/abrazinskas/FewSum)":337,
"https://arxiv.org/abs/1905.10060":338,
"google_wellformed_query(https://huggingface.co/datasets/google_wellformed_query)":339,
"https://huggingface.co/datasets/ollie":340,
"https://huggingface.co/datasets/hope_edi":341,
"https://www.usableprivacy.org/data":342,
"https://github.com/CogComp/perspectrum/tree/master/data/dataset":343,
"lhoestq":344,
"Eurlex (dataset link- https://huggingface.co/datasets/eurlex)":345,
"AI2 Arithmetic Questions (dataset link- https://ai2-public-datasets.s3.amazonaws.com/arithmetic-questions/arithmeticquestions.pdf)":346,
"Yelp restaurant review (dataset link- https://www.yelp.com/dataset)":347,
"https://arxiv.org/pdf/1705.04146.pdf":348,
"https://arxiv.org/abs/2103.07191":349,
"Microsoft Research Sequential Question Answering (Dataset - https://huggingface.co/datasets/msr_sqa#source-data) (Paper - https://www.microsoft.com/en-us/research/wp-content/uploads/2017/05/acl17-dynsp.pdf)":350,
"app_reviews (dataset link- https://huggingface.co/datasets/app_reviews)":351,
"emea fr-sk (dataset link- https://huggingface.co/datasets/emea)":352,
"emea es-lt (dataset link- https://huggingface.co/datasets/emea)":353,
"emea bg-el (dataset link- https://huggingface.co/datasets/emea)":354,
"https://huggingface.co/datasets/craigslist_bargains Craigslist Bargains":355,
"https://github.com/google-research-datasets/QED QED":356,
"paws-x":357,
"pec":358,
"proto_qa (Link - https://huggingface.co/datasets/proto_qa)":359,
"peixian/rtGender (Link - https://huggingface.co/datasets/peixian/rtGender)":360,
"COPA (\"https://aclanthology.org/S12-1052.pdf\")":361,
"giga_fren (dataset link- https://huggingface.co/datasets/giga_fren)":362,
"poleval2019_mt (dataset link- https://huggingface.co/datasets/poleval2019_mt)":363,
"poem_sentiment (dataset link- https://huggingface.co/datasets/poem_sentiment)":364,
"https://huggingface.co/datasets/math_dataset":365,
"https://huggingface.co/datasets/BSC-TeMU/viquiquad":366,
"cdt(https://huggingface.co/datasets/cdt)":367,
"para_pat(hhttps://huggingface.co/datasets/para_pat)":368,
"(financial_phrasebank) https://huggingface.co/datasets/financial_phrasebank":369,
"(Pubmed_QA) https://huggingface.co/datasets/pubmed_qa":370,
"HIPPOCORPUS https://msropendata.com/datasets/0a83fb6f-a759-4a17-aaa2-fbac84577318":371,
"conv_ai_2 https://huggingface.co/datasets/conv_ai_2":372,
"Inquisitive.<sep>Link: https://github.com/wjko2/INQUISITIVE/blob/master/questions.txt":373,
"https://huggingface.co/datasets/corypaik/prost":374,
"corypaik/prost<sep>Link: https://cdn-lfs.huggingface.co/datasets/corypaik/prost/05d773ae2768047579ea22415fc593199430747027b3df5621e60044fe893bde":375,
"https://aclanthology.org/2020.acl-main.92.pdf":376,
"CFQ/MCD1":377,
"MS MARCO":378,
"opus_xhosanavy (\"https://huggingface.co/datasets/opus_xhosanavy\")":379,
"emotion (\"https://huggingface.co/datasets/emotion\")":380,
"kde4 (https://huggingface.co/datasets/kde4)":381,
"schema_guided_dstc8 (https://huggingface.co/datasets/schema_guided_dstc8)":382,
"Quail(Link - https://huggingface.co/datasets/quail)":383,
"Rotten Tomatoes(Link - https://huggingface.co/datasets/rotten_tomatoes)":384,
"Go Emotions(Link - https://huggingface.co/datasets/go_emotions)":385,
"GWSD":386,
"gap":387,
"miam":388,
"freebase_qa":389,
"Deceptive Opinion Spam dataset  (https://myleott.com/op-spam.html)":390,
"Hate Speech Offensive Classification  (https://huggingface.co/datasets/hate_speech_offensive)":391,
"DialogRE":392,
"Bianet : https://huggingface.co/datasets/bianet":393,
"Bianet (https://huggingface.co/datasets/bianet)":394,
"CoQA Dataset: https://www.tensorflow.org/datasets/catalog/coqa":395,
"CodeXGLUE Dataset: https://github.com/microsoft/CodeXGLUE/tree/main/Code-Code/Clone-detection-POJ-104":396,
"Event2Mind":397,
"coached_conv_pref":398,
"https://github.com/luofuli/DualRL":399,
"generated_reviews_enth (https://huggingface.co/datasets/generated_reviews_enth)":400,
"DailyDialog (http://yanran.li/dailydialog)":401,
"wiki_auto":402,
"Turk (Dataset - https://huggingface.co/datasets/turk) (Paper - https://aclanthology.org/Q16-1029.pdf)":403,
"defeasible-NLI-atomic (https://github.com/rudinger/defeasible-nli)":404,
"defeasible-NLI (https://github.com/rudinger/defeasible-nli)":405,
"defeasible-NLI-social (https://github.com/rudinger/defeasible-nli)":406,
"https://indicnlp.ai4bharat.org/papers/arxiv2020_indicnlp_corpus.pdf":407,
"LeetCode":408,
"e2e (https://arxiv.org/abs/1706.09254)":409,
"BSC-TeMU/ancora-ca-ner":410,
"librispeech_asr, https://huggingface.co/datasets/librispeech_asr":411,
"Ruletaker, https://allenai.org/data/ruletaker":412,
"SherLIiC: A Typed Event-Focused Lexical Inference Benchmark for Evaluating Natural Language Inference":413,
"":414
}
source_colour_dict2 = {}
for key in source_colour_dict:
    source_colour_dict2[key] = source_colour_dict[key]
    source_colour_dict2[key.lower()] = source_colour_dict[key]

with open('C:\\Users\\Admin\\IdeaProjects\\project_mentored_project_3_group-nlp-test-bed\\front-end\\src\\Components\\embeddings.js', 'w') as convert_file:
    convert_file.write('let embeddings = [')
    for emb in task_definitions:
        category_number = str(emb['categories'][0])
        if "->" in str(emb['categories'][0]) :
            category_number = category_number[0:category_number.index("->")]
        else:
            category_number = category_number
        convert_file.write('{ "x": ')
        convert_file.write(str(emb['x']))
        convert_file.write(",")
        convert_file.write(' "y": ')
        convert_file.write(str(emb['y']))
        convert_file.write(",")
        convert_file.write(' "id": ')
        convert_file.write('"')
        convert_file.write(str(emb['_id']))
        convert_file.write('"')
        convert_file.write(",")
        convert_file.write(' "category": ')
        convert_file.write('"')
        convert_file.write(str(emb['categories'][0]))
        convert_file.write('"')
        convert_file.write(",")
        convert_file.write(' "source": ')
        convert_file.write(json.dumps(str(emb['source'][0])))
        convert_file.write(",")
        convert_file.write(' "category_number": ')
        convert_file.write(str(category_colour_dict2[category_number.lower()]))
        convert_file.write(",")
        convert_file.write(' "source_number": ')
        convert_file.write(str(source_colour_dict2[str(emb['source'][0]).lower()]))
        convert_file.write(",")
        convert_file.write(' "z": ')
        convert_file.write(str(emb['z']))
        convert_file.write("},\n")
    convert_file.write('];\n\n')
    convert_file.write('export default embeddings;')