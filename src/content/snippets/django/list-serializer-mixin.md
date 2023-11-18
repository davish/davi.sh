---
title: "ListSerializerMixin"
published: 2023-03-28
category: "Django"
description: "Specify a different viewset serializer for lists"
---

I often want to include [related nested objects](https://www.django-rest-framework.org/api-guide/relations/#nested-relationships) in my [Django REST Framework `ModelViewSet`s](https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset) for CRUD operations, but don't want those related objects cluttering up the list view. To accomplish this, you can return a serializer from `get_serializer_class()` that doesn't include the nested relation when the ViewSet action is `list`. I ended up doing this on a bunch of viewsets, so I factored the logic out into a separate mixin:

```python
from typing import Union
from rest_framework import viewsets

class ListSerializerMixin(object):  
    list_serializer_class = None  
  
    def get_serializer_class(  
        self: Union[viewsets.GenericViewSet, "ListSerializerMixin"]  
    ):  
        if self.list_serializer_class and self.action == "list":  
            return self.list_serializer_class  
        return super(viewsets.GenericViewSet, self).get_serializer_class()
```

On your viewset, you can inherit from `ListSerializerMixin`[^1] then add the `list_serializer_class` attribute next to `serializer_class` instead of overriding the method directly:

```python
class ObjectViewSet(ListSerializerMixin, viewsets.ModelViewSet):  
    serializer_class = ObjectDetailSerializer  
    list_serializer_class = ObjectListSerializer  
    permission_classes = [IsAuthenticated]  
  
    def get_queryset(self):  
        return Object.objects.all().prefetch_related("related_items")
```

This leads to serializers that are easier to read at-a-glance, and slightly easier to write.

[^1]: Make sure to add the mixin *before* the ViewSet in your superclass list. 