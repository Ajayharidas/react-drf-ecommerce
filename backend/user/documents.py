# from django_elasticsearch_dsl import Document, fields
# from django_elasticsearch_dsl.registries import registry
# from brand.models import Brand
# from category.models import Category
# from product.models import Product


# @registry.register_document
# class ProductDocument(Document):
#     brand = fields.ObjectField(
#         properties={
#             "name": fields.TextField(),
#         }
#     )
#     categories = fields.ListField(
#         fields.ObjectField(
#             properties={"id": fields.IntegerField(), "name": fields.TextField()}
#         )
#     )

#     class Index:
#         name = "products"
#         settings = {"number_of_shards": 1, "number_of_replicas": 0}

#     class Django:
#         model = Product
#         fields = ["name"]
#         related_models = [Brand, Category]

#     def prepare_categories(self, instance):
#         return [
#             {"id": category.id, "name": category.name}
#             for category in instance.category.all()
#         ]
