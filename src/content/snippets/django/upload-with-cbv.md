---
title: "form_valid() overload"
published: 2023-03-25
category: "Django"
description: "Handle uploads with class-based generic views"
---

The Django documentation describes how to bind uploaded files when using function-based views. There's no easy equivalent I could find on how to do the same for generic, class based views like [CreateView](https://docs.djangoproject.com/en/4.1/ref/class-based-views/generic-editing/#django.views.generic.edit.CreateView). The right way to do it is to override the `form_valid()` method on the view:

```python
def form_valid(self, form):
    file = self.request.FILES["file"]
    self.object = form.save(commit=False)
    self.object.file = file
    self.object.save()
    return HttpResponseRedirect(self.get_success_url())
```
