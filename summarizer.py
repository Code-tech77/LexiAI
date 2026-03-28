from newspaper import Article
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

def extract_article_text(url):
    article = Article(url)
    article.download()
    article.parse()
    return article.text

def summarize_text(text, sentence_count=3):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LexRankSummarizer()

    summary = summarizer(parser.document, 5)
    return " ".join([str(sentence) for sentence in summary])

def summarize_url(url):
    text = extract_article_text(url)
    summary = summarize_text(text, sentence_count=3)
    return summary