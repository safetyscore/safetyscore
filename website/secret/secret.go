package secret

// Secret values. These are initialised from a file in a private repo right now.
// We'll switch to using Vault and cycle the secrets once everything is up and
// running.
var (
	CookieSigningKey []byte
	SlackAPIKey      string
)
