.PHONY: encode-hashtags

# public/hashtags.md (平文, gitignore対象) を public/hashtags.enc (コミット対象) へBase64化する
encode-hashtags:
	node scripts/encode-hashtags.mjs
