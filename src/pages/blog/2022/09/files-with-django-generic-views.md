---
layout: "/src/layouts/BlogPost.astro"
title: "Upload files to Django class-based generic views"
date: 2022-09-30
draft: true
tags: ['django']
description: ""
---
- https://docs.djangoproject.com/en/4.1/ref/forms/api/#binding-uploaded-files
- The example is with a basic function-based view. How about with a generic class-based view like `CreateView`?

Override `form_valid`:

```python
def form_valid(self, form):  
    file = self.request.FILES["file"]  
    self.object = form.save(commit=False)  
    self.object.file = file  
    self.object.save()
    return HttpResponseRedirect(self.get_success_url())
```