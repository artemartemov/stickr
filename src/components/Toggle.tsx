import { h, ComponentChildren } from 'preact';

interface ToggleProps {
  checked?: boolean;
  value?: boolean;
  onChange?: () => void;
  onValueChange?: (value: boolean) => void;
  children?: ComponentChildren;
  disabled?: boolean;
}

export function Toggle({ checked, value, onChange, onValueChange, children, disabled = false }: ToggleProps) {
  const isChecked = checked ?? value ?? false;

  const handleChange = () => {
    if (disabled) return;
    if (onChange) onChange();
    if (onValueChange) onValueChange(!isChecked);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: '0',
        borderRadius: '4px',
        marginLeft: '-7px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      onClick={handleChange}
    >
      {/* Label comes FIRST - exactly like DS Coverage */}
      {children && (
        <label
          style={{
            lineHeight: '32px',
            userSelect: 'none',
            paddingRight: '6px',
            paddingLeft: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            pointerEvents: 'none',
          }}
        >
          {children}
        </label>
      )}

      {/* Input comes SECOND - exactly like DS Coverage */}
      <input
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        readOnly
        style={{
          padding: '0',
          appearance: 'none',
          margin: '0',
          width: '24px',
          height: '32px',
          backgroundImage: isChecked
            ? `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAA4CAYAAAACRf2iAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATLSURBVHgB7Zu/VtswFMZvzNINh6lbHVi6lZGNsLUT9AmaNwCeANjYIG8AWzsVtnZK2DqGB4C4T4C7tQPQ70tkjiz8j3CI5Fa/c3yQJQdLuvfqSleyiMfj8Xg8Ho/H4/nfaMmMRFHUDYJgFcn1+/v71VarFSIdynxI8M4Y74yRvry7uxvGcTyUBvIkAaDTQ3T6NpI7Mr/OrgsFMry9vT2AMGJpCLUEoDp+T6Yd7zwQxElTBLFQ9cDy8vI2GnSGZFeaA4fEraWlpV83NzcjcZhSC0DnH0mx1ie4zjD+XuAvG0mFS2QO0CL5R6Yd3cW1KcVD4vH19fWuOEquANhANOorG5dTHOPqo+NP5tXhdUCde6jvHq7ILIPDHuHacKm+KbkCgOZTo98Z2az8AbTpWBwGdafF0l9lLAICGI7H4w1xjEcCKBh2Ymj8RlNmF7CGCJYwyLEG54ajjBNeWVnp4c+hngfNucT1oUlTuwSEYXiOJP3Da61ord1u0zH/EEd4sABqDaaaA5k6t5RGab5JgSUkaFPHFX8QpAlUcl+ynZ80ufMJ607nK1P/lZKuaZxgYgFK+8dG2a7rDrcuyjEf6XlQrrYLVjARQKfTOYEFfNLyY3R+RxxAxZy2oMmb6VDCaSXyRk9Z7aKNY2Mo4oxuXywzGYJQsXU9E/cHYhmuRTgjU35pW+88pFchhB6tls+ohVkp+E3fyNoWB2gpDRtoeQk0oy0WUbGnoTxei+RSZ6Gl/ieH2QdhKR83FIugTkFXz1BxH6soJ1mr8wktosqxUjgQ0rnxnlWxTMDKG3kXYhFOCGS2qOsOrbnsAa6GjfvS5+dBgEq80TPg2KxGD9V0eCborCseGRnvqm1lLwWdcGTkxWKRZ3bKZkV5bNxb31QKzEo4MDd+zrgclRXmtM0JAXgsQgFktKLOnPol4Wa7zE6p/8ppm/WVMJ2wWYlILAIfcC4zgt9WTSAi4z4Wy3AdcKlnLCwsWJ0bY3E08zqEoYmycrNtUL6fYpnAnBuDdbGIWpn25en0q+JCEG5Xv69hMS9OgEplKgGBbNn2A6jTPsMLdZ/nphF/U/Wc2rzX3zMUywRK48x4eU8sosIGjOPXsYQ+V7RV02e12xdmX2P/NF06DXUuUsgORVBwh7tX6OBT3SLUTIknMzb4TJ21C36TiRXxFJ04QLohQ62/Mcr+pQ0ZKlSmLWpbMhbLTDblsYf9G5vVDEGvaWVri4uLX7jBLQ1G7Qt/RvJVmseji+Px+FQc4GElrJyY6QsGKjrZSLSDBpmxv2q6Ok8ejqUoK/iD5HutnBXvhmH4vWmWoDqfa4q3ej60fxfaPxRHyJwL4nkZcyjiuRoedMVwdN4UIWia/9Yo6sOvHYpDPDodDSF8g8Z3jQ1snhXt0UJcOtSUhzrNzTFfP5A1WStA86v2C+ZO2eHcQc5uGeGHEAdXV1cn4ghqFteT6fQ5Msu52sf1sTGHc1OgTZy6Fa0JErV/fKF20awcT0fHM3RCzS5avXPY2RFHqfxCpuzYt+M04jR35Rcy8LsjddC1XTAkuQhXyR9dmu0U8dSP9CK1ab7uoEVQ49nxxy6O9UU89zPVLpLv4OAiJZB5RVEZrEtUOPmCEV0XAmsej8fj8Xg8Ho/HU4e/J8hBQQWRiUgAAAAASUVORK5CYII=')`
            : `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAA4CAYAAAACRf2iAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAWhSURBVHgB7ZtbTyNHEIWLMQYMxFxslptAwVxW0UZCWpIH8hAh5Y/zkpWSgBQeEFpkjMCwgHa5GWIDNpBzLI/VM5gZ2yu5e3b7kyx7ehjc1V1dXVVdFrFYLBaLxWKxWCzfG13SJpOTk+l4PJ7s7u5O4TL59PQU7+rqiksHeH5+LuO7i4+PjyV8Ltzd3Z2fnJx8kQjS0gSsrKzELy4uMhB6rlOD3SzoTxFKcH5/f7+LyShKRGhqAjjwV1dXbyHgnEQAKEg+KhMROgGzs7MZx3GWTNP4MLgi8Nrd29vLi8EETsD8/PzPr2k97TBeZ+Vy+UupVCpkMpni5uZmWToAV2Qul+tPJBLJnp4e7kETrylILBbLZbPZbTGUhhNQMzm/YvBTLx6AZlUqlf2xsbF8pwa8Gaampmb6+vqWoBT9/ntwFK6np6c/rK+vV8QwGk7A4uLi7xjkIbWtpvEfDw4O9sVgXjOZaDuHOfoghhHzN9DswL2bUNuo9XD1/jw6OvoshnN9fX0J0/QJbiplqE8CV0Y6naYXZ5QMngnA4M/A7PyktnH5FovFv6Pk2t3e3pZhjs5g/9NQnl63HZMwkkwmK5wkMQTH/YDAqh8dXFJvUvMhzEaUBt+FfYYr+g9lUNtpntbW1rrFEOorAMvzHd/ca9p8mp0oDr6LshJmMBFVWfmO9pgppqi6Aqj96NiMeoMbbpQH34UywKzuqm3Y4zKmrIJqJ3p7e1+Ynma9HeaEBgYGxiHkhOsCct9AfFAwJRo9PDzMIU6ZU11UyDePt4+imeoKgF30+PuMIMMeZKxAjwlLfJUapQpHF5YrCvf+WFhYeGeCtjF2Ua+ZzxIDcBCgpNTBo+0PC985+IVCYbWZ3BAn5/j4+Dfdk8DAkbK514wTuHpFMw5CeX8nTsMeYmLOH6gFwb9FDPFWNFKL2j2yMZ0umnGgCZ5OwGM4D3qAG3Y7WVGuBN0a9/Dw4JENKyIlmnEwmJ7cCdyzQtAD/g27FbhZi0awJ3lkM2IF4JVQG5aXl/8LeaZp0+OHnpJoZGRkxOOR8RRPNOP4k1ZhGUO/yWqFRpnKTuLP3ppwxuGIRSuO6pqRMHcRm+nXBFbXohG6z+q1X3YdcBP2dGJra2sg6AFsXGfSJqxgEI1cXl56TKA/UacDB2kDz6CMjo4G2ngk6E6kTZiaEI349y/EJyXRjINOeHxjXAf66ohqz3nOKi3CZ3TnhWA+PX6/X/l04KBTHrsMLRkP2weGhoZ2WzEnTM7xGdGPxw1mQZdoJnZzc1MaHh7OqPlyBGMPQadG0OQnJOI+IbLkJj4S+AXQfAz+lu4DfJ724W3avab9z+fz2qslqpqObGgOA1nP1UBjmWoINDO1Ad1GemG/Fh0PuTaWwuF/npZKpVOaLDEA/2kfq+jEAKoTgAhxH1pfnwAGTKwuYB497B/U7Pq/YjCUxR8E6nYIXKqBGLXZv7Hy7JSJN4k4lIGyqG0sXTTltK8eCdc2Vk++PJFIrEZ5Eth3yqCmHGgeTdF+Uj+U58aaTCafoC1vlPtxZBBTsPGfecAtEYKDPzg4+Ats/Q9qO+Tbhmk1wv4TT10QPR8WL6meDQToY5ETqwuiMgmu5vsHn2YWp31ZMYgXlXEs10ilUmnfphVnaQdXiElFTY3ghguFeY+PfWo7Y5FsNrshhhFr1JjJZE6LxeIbtaqM8QHNE1IVM3hVkFfRHkW6MMkGfoTivEc/p92YxoV1odjj/qKZFcMILE9nRQOPEhvdq23YpzzC5CmarvJ0DDzLD8e/qfJ0laCyb5OJSjV3LOwPkKoo1Mr7+CO8to8jOwm1HsHlxs7OjjHezmu09CM9ehdMO7CQy7QVQY1nSoVRvUk/HAmj7Z+psqCLNUXM/9QqKxKd/JkqBpuDXGA6nRldU3JOFovFYrFYLBaLxRLG/7kT6hCwaAbkAAAAAElFTkSuQmCC')`,
          transition: '0.2s all ease-in-out',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          cursor: disabled ? 'not-allowed' : 'pointer',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
