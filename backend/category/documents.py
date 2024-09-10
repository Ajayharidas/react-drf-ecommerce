from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from category.models import Category

@registry.register_document
class CategoryDocument(Document):
    name = fields.TextField(required=True,analyzer="autocomplete_analyzer")

    class Index:
        name = "categories"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "analysis": {
                "analyzer": {
                    "autocomplete_analyzer": {
                        "type": "custom",
                        "tokenizer": "edge_ngram_tokenizer",
                        "filter": ["lowercase"]
                    }
                },
                "tokenizer": {
                    "edge_ngram_tokenizer": {
                        "type": "edge_ngram",
                        "min_gram": 3,
                        "max_gram": 20,
                        "token_chars": ["letter"]
                    }
                }
            }
        }

    class Django:
        model = Category
        fields = ["id", "slug"]
