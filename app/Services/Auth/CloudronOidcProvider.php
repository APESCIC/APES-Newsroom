<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use League\OAuth2\Client\Provider\GenericProvider;
use RuntimeException;

/**
 * Thin wrapper around Cloudron's discovery-document-based OIDC provider.
 *
 * Cloudron exposes a generic OIDC issuer (discovery URL, issuer, client
 * id/secret) rather than a named provider, so this builds a
 * league/oauth2-client GenericProvider from the discovery document
 * instead of depending on a fixed-provider package like Socialite.
 */
class CloudronOidcProvider
{
    private ?GenericProvider $provider = null;

    public function authorizationUrl(): string
    {
        return $this->provider()->getAuthorizationUrl(['scope' => ['openid', 'email', 'profile']]);
    }

    public function getState(): string
    {
        return $this->provider()->getState();
    }

    public function exchangeCodeForIdentity(string $code): StaffOidcIdentity
    {
        $token = $this->provider()->getAccessToken('authorization_code', ['code' => $code]);
        $owner = $this->provider()->getResourceOwner($token)->toArray();

        return new StaffOidcIdentity(
            sub: (string) ($owner['sub'] ?? ''),
            email: (string) ($owner['email'] ?? ''),
            name: (string) ($owner['name'] ?? $owner['email'] ?? ''),
        );
    }

    private function provider(): GenericProvider
    {
        if ($this->provider) {
            return $this->provider;
        }

        $discovery = $this->discoveryDocument();

        return $this->provider = new GenericProvider([
            'clientId' => config('services.cloudron_oidc.client_id'),
            'clientSecret' => config('services.cloudron_oidc.client_secret'),
            'redirectUri' => route('cloudron.callback'),
            'urlAuthorize' => $discovery['authorization_endpoint'],
            'urlAccessToken' => $discovery['token_endpoint'],
            'urlResourceOwnerDetails' => $discovery['userinfo_endpoint'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function discoveryDocument(): array
    {
        $discoveryUrl = config('services.cloudron_oidc.discovery_url');

        if (! $discoveryUrl) {
            throw new RuntimeException('Cloudron OIDC discovery URL is not configured.');
        }

        return Cache::remember(
            'cloudron_oidc.discovery_document',
            now()->addHour(),
            fn () => Http::get($discoveryUrl)->throw()->json(),
        );
    }
}
